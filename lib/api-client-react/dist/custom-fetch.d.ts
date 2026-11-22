export type CustomFetchOptions = RequestInit & {
  responseType?: "json" | "text" | "blob" | "auto";
};

export type ErrorType<T = unknown> = ApiError<T>;
export type BodyType<T> = T;
export type AuthTokenGetter = () => Promise<string | null> | string | null;

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "sb_publishable_xP2anh-c7_5Y7eekLhV0ag_BTYMLs7F";
const ADMIN_SECRET_CODE = "6C2026";

export function setBaseUrl(_url: string | null): void {}
export function setAuthTokenGetter(_getter: AuthTokenGetter | null): void {}

export class ApiError<T = unknown> extends Error {
  readonly name = "ApiError";
  readonly status: number;
  readonly statusText: string;
  readonly data: T | null;
  readonly headers: Headers;
  readonly response: Response;
  readonly method: string;
  readonly url: string;

  constructor(status: number, message: string, data: T | null = null, method = "GET", url = "") {
    super(message);
    this.status = status;
    this.statusText = message;
    this.data = data ?? ({ message } as unknown as T);
    this.headers = new Headers();
    this.response = new Response(null, { status });
    this.method = method;
    this.url = url;
  }
}

async function sbRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, err.message || "Erro no banco de dados", err);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function getCurrentSessionUser() {
  try {
    const raw = localStorage.getItem("agenda_6c_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatUser(u: any) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    name: u.name || u.username,
    role: u.role,
    createdAt: u.created_at,
  };
}

function formatActivity(a: any) {
  return {
    id: a.id,
    title: a.title,
    description: a.description || "",
    subject: a.subject,
    dueDate: a.due_date,
    createdBy: a.created_by,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  };
}

function formatAnnouncement(a: any) {
  return {
    id: a.id,
    title: a.title,
    content: a.content,
    priority: a.priority || "normal",
    createdBy: a.created_by,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  };
}

export async function customFetch<T = unknown>(
  input: RequestInfo | URL,
  options: CustomFetchOptions = {}
): Promise<T> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};
  const path = url.replace(/^.*\/api/, "");

  if (path === "/healthz") {
    return { status: "ok" } as T;
  }

  if (path === "/auth/register" && method === "POST") {
    const isAdmin = body.adminCode && body.adminCode.trim() !== "";
    if (isAdmin && body.adminCode.trim() !== ADMIN_SECRET_CODE) {
      throw new ApiError(400, "Código de administrador inválido.");
    }
    const existing = await sbRequest(
      `school_users?or=(username.eq.${encodeURIComponent(body.username)},email.eq.${encodeURIComponent(body.email)})`
    );
    if (existing && existing.length > 0) {
      throw new ApiError(409, "Usuário ou e-mail já cadastrado.");
    }
    const newUser = {
      id: crypto.randomUUID(),
      username: body.username.trim(),
      email: body.email.trim(),
      name: body.name?.trim() || body.username.trim(),
      password_hash: body.password,
      role: isAdmin ? "admin" : "student",
    };
    const created = await sbRequest("school_users", {
      method: "POST",
      body: JSON.stringify(newUser),
    });
    const formatted = formatUser(Array.isArray(created) ? created : created);
    localStorage.setItem("agenda_6c_user", JSON.stringify(formatted));
    return formatted as T;
  }

  if (path === "/auth/login" && method === "POST") {
    const users = await sbRequest(
      `school_users?username=eq.${encodeURIComponent(body.username.trim())}`
    );
    if (!users || users.length === 0 || users.password_hash !== body.password) {
      throw new ApiError(401, "Usuário ou senha incorretos.");
    }
    const formatted = formatUser(users);
    localStorage.setItem("agenda_6c_user", JSON.stringify(formatted));
    return formatted as T;
  }

  if (path === "/auth/logout" && method === "POST") {
    localStorage.removeItem("agenda_6c_user");
    return null as T;
  }

  if (path === "/me" && method === "GET") {
    const user = getCurrentSessionUser();
    if (!user) throw new ApiError(401, "Não autenticado");
    return user as T;
  }

  if (path === "/dashboard-summary" && method === "GET") {
    const today = new Date().toISOString().split("T");
    const [activitiesRaw, announcementsRaw] = await Promise.all([
      sbRequest("school_activities?order=due_date.asc"),
      sbRequest("school_announcements?order=created_at.desc&limit=1"),
    ]);
    const activities = (activitiesRaw || []).map(formatActivity);
    const upcoming = activities.filter((a: any) => a.dueDate >= today);
    const past = activities.filter((a: any) => a.dueDate < today);
    return {
      upcomingCount: upcoming.length,
      pastCount: past.length,
      nextActivity: upcoming || null,
      latestAnnouncement: announcementsRaw?. ? formatAnnouncement(announcementsRaw) : null,
    } as T;
  }

  if (path === "/activities" && method === "GET") {
    const rows = await sbRequest("school_activities?order=due_date.asc");
    return (rows || []).map(formatActivity) as T;
  }

  if (path === "/activities" && method === "POST") {
    const user = getCurrentSessionUser();
    if (!user) throw new ApiError(401, "Faça login primeiro");
    const created = await sbRequest("school_activities", {
      method: "POST",
      body: JSON.stringify({
        title: body.title,
        description: body.description || "",
        subject: body.subject,
        due_date: body.dueDate,
        created_by: user.id,
      }),
    });
    return formatActivity(Array.isArray(created) ? created : created) as T;
  }

  if (path.startsWith("/activities/")) {
    const id = path.split("/");
    if (method === "PATCH") {
      const patchData: any = {};
      if (body.title !== undefined) patchData.title = body.title;
      if (body.description !== undefined) patchData.description = body.description;
      if (body.subject !== undefined) patchData.subject = body.subject;
      if (body.dueDate !== undefined) patchData.due_date = body.dueDate;
      const updated = await sbRequest(`school_activities?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify(patchData),
      });
      return formatActivity(Array.isArray(updated) ? updated : updated) as T;
    }
    if (method === "DELETE") {
      await sbRequest(`school_activities?id=eq.${id}`, { method: "DELETE" });
      return null as T;
    }
  }

  if (path === "/announcements" && method === "GET") {
    const rows = await sbRequest("school_announcements?order=created_at.desc");
    return (rows || []).map(formatAnnouncement) as T;
  }

  if (path === "/announcements" && method === "POST") {
    const user = getCurrentSessionUser();
    if (!user) throw new ApiError(401, "Faça login primeiro");
    const created = await sbRequest("school_announcements", {
      method: "POST",
      body: JSON.stringify({
        title: body.title,
        content: body.content,
        priority: body.priority || "normal",
        created_by: user.id,
      }),
    });
    return formatAnnouncement(Array.isArray(created) ? created : created) as T;
  }

  if (path.startsWith("/announcements/")) {
    const id = path.split("/");
    if (method === "PATCH") {
      const patchData: any = {};
      if (body.title !== undefined) patchData.title = body.title;
      if (body.content !== undefined) patchData.content = body.content;
      if (body.priority !== undefined) patchData.priority = body.priority;
      const updated = await sbRequest(`school_announcements?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify(patchData),
      });
      return formatAnnouncement(Array.isArray(updated) ? updated : updated) as T;
    }
    if (method === "DELETE") {
      await sbRequest(`school_announcements?id=eq.${id}`, { method: "DELETE" });
      return null as T;
    }
  }

  throw new ApiError(404, `Rota não encontrada: ${path}`);
}
