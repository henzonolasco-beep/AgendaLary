import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "sb_publishable_xP2anh-c7_5Y7eekLhV0ag_BTYMLs7F";
const ADMIN_SECRET_CODE = "6C2026";

async function sbFetch(path: string, options: RequestInit = {}) {
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
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw { status: res.status, message: data?.message || "Erro no banco de dados" };
  }
  return data;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(data === null ? null : JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function firstItem(val: any) {
  return Array.isArray(val) ? val.at(0) : val;
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

const originalFetch = window.fetch.bind(window);

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

  if (!url.includes("/api/")) {
    return originalFetch(input, init);
  }

  const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
  const path = url.replace(/^.*\/api/, "");
  let body: any = {};
  if (init?.body && typeof init.body === "string") {
    try {
      body = JSON.parse(init.body);
    } catch {}
  }

  try {
    if (path === "/healthz") {
      return jsonResponse({ status: "ok" });
    }

    if (path === "/auth/register" && method === "POST") {
      const isAdmin = body.adminCode && body.adminCode.trim() !== "";
      if (isAdmin && body.adminCode.trim() !== ADMIN_SECRET_CODE) {
        return jsonResponse({ message: "Código de administrador inválido." }, 400);
      }
      const existing = await sbFetch(
        `school_users?or=(username.eq.${encodeURIComponent(body.username)},email.eq.${encodeURIComponent(body.email)})`
      );
      if (Array.isArray(existing) && existing.length > 0) {
        return jsonResponse({ message: "Usuário ou e-mail já cadastrado." }, 409);
      }
      const created = await sbFetch("school_users", {
        method: "POST",
        body: JSON.stringify({
          id: crypto.randomUUID(),
          username: body.username.trim(),
          email: body.email.trim(),
          name: body.name?.trim() || body.username.trim(),
          password_hash: body.password,
          role: isAdmin ? "admin" : "student",
        }),
      });
      const userObj = formatUser(firstItem(created));
      localStorage.setItem("agenda_6c_user", JSON.stringify(userObj));
      return jsonResponse(userObj, 201);
    }

    if (path === "/auth/login" && method === "POST") {
      const users = await sbFetch(
        `school_users?username=eq.${encodeURIComponent(body.username.trim())}`
      );
      const found = firstItem(users);
      if (!found || found.password_hash !== body.password) {
        return jsonResponse({ message: "Usuário ou senha incorretos." }, 401);
      }
      const userObj = formatUser(found);
      localStorage.setItem("agenda_6c_user", JSON.stringify(userObj));
      return jsonResponse(userObj, 200);
    }

    if (path === "/auth/logout" && method === "POST") {
      localStorage.removeItem("agenda_6c_user");
      return jsonResponse(null, 204);
    }

    if (path === "/me" && method === "GET") {
      const raw = localStorage.getItem("agenda_6c_user");
      if (!raw) return jsonResponse({ message: "Não autenticado" }, 401);
      return jsonResponse(JSON.parse(raw), 200);
    }

    if (path === "/dashboard-summary" && method === "GET") {
      const today = new Date().toISOString().split("T").at(0) || "";
      const [activitiesRaw, announcementsRaw] = await Promise.all([
        sbFetch("school_activities?order=due_date.asc"),
        sbFetch("school_announcements?order=created_at.desc&limit=1"),
      ]);
      const activities = (activitiesRaw || []).map(formatActivity);
      const upcoming = activities.filter((a: any) => a.dueDate >= today);
      const past = activities.filter((a: any) => a.dueDate < today);
      const latestAnn = firstItem(announcementsRaw);
      return jsonResponse({
        upcomingCount: upcoming.length,
        pastCount: past.length,
        nextActivity: upcoming.at(0) || null,
        latestAnnouncement: latestAnn ? formatAnnouncement(latestAnn) : null,
      });
    }

    if (path === "/activities" && method === "GET") {
      const rows = await sbFetch("school_activities?order=due_date.asc");
      return jsonResponse((rows || []).map(formatActivity));
    }

    if (path === "/activities" && method === "POST") {
      const raw = localStorage.getItem("agenda_6c_user");
      if (!raw) return jsonResponse({ message: "Faça login primeiro" }, 401);
      const user = JSON.parse(raw);
      const created = await sbFetch("school_activities", {
        method: "POST",
        body: JSON.stringify({
          title: body.title,
          description: body.description || "",
          subject: body.subject,
          due_date: body.dueDate,
          created_by: user.id,
        }),
      });
      return jsonResponse(formatActivity(firstItem(created)), 201);
    }

    if (path.startsWith("/activities/")) {
      const id = path.split("/").at(2);
      if (method === "PATCH") {
        const patchData: any = {};
        if (body.title !== undefined) patchData.title = body.title;
        if (body.description !== undefined) patchData.description = body.description;
        if (body.subject !== undefined) patchData.subject = body.subject;
        if (body.dueDate !== undefined) patchData.due_date = body.dueDate;
        const updated = await sbFetch(`school_activities?id=eq.${id}`, {
          method: "PATCH",
          body: JSON.stringify(patchData),
        });
        return jsonResponse(formatActivity(firstItem(updated)));
      }
      if (method === "DELETE") {
        await sbFetch(`school_activities?id=eq.${id}`, { method: "DELETE" });
        return jsonResponse(null, 204);
      }
    }

    if (path === "/announcements" && method === "GET") {
      const rows = await sbFetch("school_announcements?order=created_at.desc");
      return jsonResponse((rows || []).map(formatAnnouncement));
    }

    if (path === "/announcements" && method === "POST") {
      const raw = localStorage.getItem("agenda_6c_user");
      if (!raw) return jsonResponse({ message: "Faça login primeiro" }, 401);
      const user = JSON.parse(raw);
      const created = await sbFetch("school_announcements", {
        method: "POST",
        body: JSON.stringify({
          title: body.title,
          content: body.content,
          priority: body.priority || "normal",
          created_by: user.id,
        }),
      });
      return jsonResponse(formatAnnouncement(firstItem(created)), 201);
    }

    if (path.startsWith("/announcements/")) {
      const id = path.split("/").at(2);
      if (method === "PATCH") {
        const patchData: any = {};
        if (body.title !== undefined) patchData.title = body.title;
        if (body.content !== undefined) patchData.content = body.content;
        if (body.priority !== undefined) patchData.priority = body.priority;
        const updated = await sbFetch(`school_announcements?id=eq.${id}`, {
          method: "PATCH",
          body: JSON.stringify(patchData),
        });
        return jsonResponse(formatAnnouncement(firstItem(updated)));
      }
      if (method === "DELETE") {
        await sbFetch(`school_announcements?id=eq.${id}`, { method: "DELETE" });
        return jsonResponse(null, 204);
      }
    }

    return jsonResponse({ message: `Rota não encontrada: ${path}` }, 404);
  } catch (err: any) {
    return jsonResponse({ message: err?.message || "Erro interno" }, err?.status || 500);
  }
};

createRoot(document.getElementById("root")!).render(<App />);
