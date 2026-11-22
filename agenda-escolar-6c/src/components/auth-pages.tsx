import { useState, type FormEvent, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpenCheck, LoaderCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const authApiPath = `${basePath}/api/auth`;

type AuthResponse = { error?: string };

async function postAuth(
  path: string,
  body?: Record<string, string>,
): Promise<void> {
  const response = await fetch(`${authApiPath}${path}`, {
    method: "POST",
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => ({}))) as AuthResponse;
    throw new Error(result.error || "Não foi possível concluir. Tente novamente.");
  }
}

function AuthFrame({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#f4f7fb] px-4 py-8">
      <section className="w-full max-w-lg rounded-3xl border border-[#e3eaf2] bg-white p-6 shadow-[0_18px_50px_rgba(35,65,96,.08)] sm:p-9">
        <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#205ca8] text-white">
            <BookOpenCheck size={23} strokeWidth={2.2} />
          </span>
          <span className="font-display text-xl text-[#263b52]">Agenda Escolar</span>
        </Link>
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold text-[#263b52]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-[#718398]">{subtitle}</p>
        </div>
        {children}
        <div className="mt-6 border-t border-[#edf1f5] pt-5 text-center text-sm text-[#718398]">
          {footer}
        </div>
      </section>
    </main>
  );
}

function AuthField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold text-[#526a81]">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-[#7d8da0]">{hint}</span>}
    </label>
  );
}

function FormError({ children }: { children: string }) {
  return (
    <p
      className="rounded-xl border border-[#f0d5d2] bg-[#fff5f4] px-3 py-2.5 text-sm font-semibold text-[#a5413b]"
      role="alert"
      data-testid="auth-error"
    >
      {children}
    </p>
  );
}

export function SignInPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await postAuth("/login", {
        username: username.trim().toLowerCase(),
        password,
      });
      queryClient.clear();
      setLocation("/home");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível entrar.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthFrame
      title="Entre na agenda"
      subtitle="Use seu nome de usuário e sua senha."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href="/sign-up" className="font-extrabold text-[#205ca8] hover:underline">
            Cadastre-se
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-sign-in">
        <AuthField label="Nome de usuário">
          <input
            autoComplete="username"
            autoCapitalize="none"
            maxLength={32}
            minLength={3}
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="form-input"
            data-testid="input-sign-in-username"
          />
        </AuthField>
        <AuthField label="Senha">
          <input
            autoComplete="current-password"
            type="password"
            maxLength={128}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="form-input"
            data-testid="input-sign-in-password"
          />
        </AuthField>
        {error && <FormError>{error}</FormError>}
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#205ca8] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#184d91] disabled:cursor-wait disabled:opacity-60"
          data-testid="button-sign-in"
        >
          {pending && <LoaderCircle size={16} className="animate-spin" />}
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </AuthFrame>
  );
}

export function SignUpPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminSignupCode, setAdminSignupCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setPending(true);
    try {
      await postAuth("/register", {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        ...(adminSignupCode ? { adminSignupCode } : {}),
      });
      queryClient.clear();
      setLocation("/home");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível criar a conta.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthFrame
      title="Crie sua conta"
      subtitle="Seu nome ajuda a identificar quem publica na agenda."
      footer={
        <>
          Já tem uma conta?{" "}
          <Link href="/sign-in" className="font-extrabold text-[#205ca8] hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5" data-testid="form-sign-up">
        <AuthField label="Nome completo">
          <input
            autoComplete="name"
            maxLength={80}
            minLength={2}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="form-input"
            data-testid="input-sign-up-name"
          />
        </AuthField>
        <AuthField
          label="Nome de usuário"
          hint="Use de 3 a 32 letras, números, pontos, traços ou sublinhados."
        >
          <input
            autoComplete="username"
            autoCapitalize="none"
            maxLength={32}
            minLength={3}
            pattern="[A-Za-z0-9._-]+"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="form-input"
            data-testid="input-sign-up-username"
          />
        </AuthField>
        <AuthField label="E-mail para contato">
          <input
            autoComplete="email"
            type="email"
            maxLength={320}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="form-input"
            data-testid="input-sign-up-email"
          />
        </AuthField>
        <AuthField label="Senha da conta" hint="Use pelo menos 8 caracteres.">
          <input
            autoComplete="new-password"
            type="password"
            minLength={8}
            maxLength={128}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="form-input"
            data-testid="input-sign-up-password"
          />
        </AuthField>
        <AuthField label="Confirme sua senha">
          <input
            autoComplete="new-password"
            type="password"
            minLength={8}
            maxLength={128}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="form-input"
            data-testid="input-sign-up-confirm-password"
          />
        </AuthField>
        <AuthField
          label="Código de administrador (opcional)"
          hint="Deixe em branco para uma conta de estudante. Este código não é sua senha de entrada."
        >
          <input
            autoComplete="off"
            type="password"
            maxLength={256}
            value={adminSignupCode}
            onChange={(event) => setAdminSignupCode(event.target.value)}
            className="form-input"
            data-testid="input-admin-signup-code"
          />
        </AuthField>
        {error && <FormError>{error}</FormError>}
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#205ca8] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#184d91] disabled:cursor-wait disabled:opacity-60"
          data-testid="button-sign-up"
        >
          {pending && <LoaderCircle size={16} className="animate-spin" />}
          {pending ? "Criando conta…" : "Criar conta"}
        </button>
      </form>
    </AuthFrame>
  );
}
