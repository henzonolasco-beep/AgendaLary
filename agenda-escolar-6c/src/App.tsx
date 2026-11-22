import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowRight,
  Bell,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  GraduationCap,
  LogOut,
  Megaphone,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { SignInPage, SignUpPage } from '@/components/auth-pages';
import {
  getGetCurrentUserQueryKey,
  getGetDashboardSummaryQueryKey,
  getListActivitiesQueryKey,
  getListAnnouncementsQueryKey,
  useCreateActivity,
  useCreateAnnouncement,
  useDeleteActivity,
  useDeleteAnnouncement,
  useGetCurrentUser,
  useGetDashboardSummary,
  useListActivities,
  useListAnnouncements,
  useUpdateActivity,
  useUpdateAnnouncement,
} from '@workspace/api-client-react';
import type { Activity, Announcement, SchoolUser } from '@workspace/api-client-react';
import NotFound from '@/pages/not-found';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function BrandMark() {
  return (
    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#205ca8] text-white shadow-sm">
      <BookOpenCheck size={23} strokeWidth={2.2} />
    </span>
  );
}

function Landing() {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f7f9fc] text-[#263b52]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3" data-testid="link-brand-home">
          <BrandMark />
          <span className="font-display text-xl sm:text-2xl">Agenda Escolar</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/sign-in" className="rounded-xl px-3 py-2 text-sm font-bold text-[#31516f] hover:bg-[#eaf0f7] sm:px-4" data-testid="link-sign-in">
            Entrar
          </Link>
          <Link href="/sign-up" className="rounded-xl bg-[#205ca8] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#184d91] sm:px-5" data-testid="link-sign-up">
            Criar conta
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:pb-24 md:pt-16 lg:px-12">
        <div className="relative z-10 rise-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce6f1] bg-white px-3.5 py-2 text-xs font-extrabold uppercase tracking-[.13em] text-[#406486]">
            <span className="h-2 w-2 rounded-full bg-[#62a88b]" />
            Turma do 6º C
          </div>
          <h1 className="font-display max-w-[680px] text-[3.25rem] leading-[1.04] tracking-[-.035em] text-[#243b55] sm:text-6xl lg:text-[4.6rem]">
            A rotina da escola, <span className="text-[#2a68b2]">mais fácil</span> de acompanhar.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#65768a] sm:text-lg sm:leading-8">
            Deveres, matérias e recados da turma reunidos em um só lugar — para alunos e responsáveis saberem o que vem pela frente.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#205ca8] px-6 py-4 font-extrabold text-white shadow-[0_10px_22px_rgba(32,92,168,.18)] transition hover:-translate-y-0.5 hover:bg-[#184d91]" data-testid="link-get-started">
              Acompanhar minha turma <ArrowRight size={18} />
            </Link>
            <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dce5ef] bg-white px-6 py-4 font-bold text-[#31516f] transition hover:bg-[#f1f5fa]" data-testid="link-existing-account">
              Já tenho uma conta
            </Link>
          </div>
          <div className="mt-9 flex items-center gap-3 text-sm text-[#65768a]">
            <span className="flex -space-x-2">
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f7f9fc] bg-[#e6cba8] text-xs font-extrabold text-[#644831]">A</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f7f9fc] bg-[#c5d9e9] text-xs font-extrabold text-[#34536e]">R</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f7f9fc] bg-[#d5e4cb] text-xs font-extrabold text-[#42613e]">M</span>
            </span>
            <span>Uma agenda simples para toda a família.</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] rise-in [animation-delay:100ms]">
          <div className="absolute -right-4 top-2 h-40 w-40 rounded-full bg-[#f6e8b8] opacity-70 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-44 w-44 rounded-full bg-[#cfe0f1] opacity-80 blur-3xl" />
          <div className="relative rotate-[1deg] rounded-[2rem] border border-[#e1e9f1] bg-white p-4 shadow-[0_28px_70px_rgba(36,67,100,.12)] sm:p-6">
            <div className="flex items-center justify-between border-b border-[#edf1f5] pb-4">
              <div className="flex items-center gap-3">
                <BrandMark />
                <div>
                  <p className="font-extrabold text-[#29445f]">6º C · Minha agenda</p>
                  <p className="mt-0.5 text-xs text-[#8190a1]">Tudo certo para esta semana</p>
                </div>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f2f6fb] text-[#5b7795]"><Bell size={18} /></span>
            </div>
            <div className="py-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[.13em] text-[#8b99a8]">Próxima atividade</p>
                  <h2 className="mt-2 font-display text-2xl text-[#29445f]">Um passo de cada vez.</h2>
                </div>
                <CalendarDays className="mb-1 text-[#2a68b2]" size={24} />
              </div>
              <div className="mt-5 rounded-2xl border border-[#e4ebf2] bg-[#fbfcfe] p-4">
                <div className="flex items-start gap-4">
                <div className="rounded-xl bg-[#eaf2fb] px-3 py-2 text-center text-[#205ca8]">
                    <CalendarDays className="mx-auto my-1" size={21} />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="font-extrabold text-[#2e4863]">Próximas atividades</p>
                    <p className="mt-1 text-sm text-[#75869a]">Deveres e entregas publicados pela escola.</p>
                  </div>
                  <ChevronRight size={18} className="mt-2 text-[#9aa8b6]" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-[#edf1f5] pt-4">
              <div className="rounded-2xl bg-[#f2f6fb] p-4">
                <BookOpen size={19} className="text-[#4279b7]" />
                <p className="mt-3 text-xs font-bold text-[#7d8da0]">Deveres</p>
                <p className="mt-0.5 font-extrabold text-[#324d68]">Por matéria</p>
              </div>
              <div className="rounded-2xl bg-[#fff8e6] p-4">
                <Megaphone size={19} className="text-[#b88424]" />
                <p className="mt-3 text-xs font-bold text-[#927d53]">Recados</p>
                <p className="mt-0.5 font-extrabold text-[#66563b]">Sempre em dia</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-2 rounded-2xl border border-[#e2eaf1] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(36,67,100,.1)] sm:-right-7">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eaf4ef] text-[#4c9271]"><Check size={18} /></span>
              <div><p className="text-xs font-bold text-[#8795a3]">Acompanhamento</p><p className="text-sm font-extrabold text-[#35526c]">Sem complicação</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e7edf3] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[.75fr_1.25fr] md:items-center md:py-16 lg:px-12">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#6c88a3]">Feita para o dia a dia</p>
            <h2 className="font-display mt-3 max-w-sm text-3xl leading-tight text-[#29445f] sm:text-4xl">O que importa, fácil de encontrar.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Feature icon={<CalendarDays size={20} />} title="Agenda clara" text="Veja atividades futuras e anteriores sem perder o fio." />
            <Feature icon={<Megaphone size={20} />} title="Avisos em destaque" text="Recados importantes chegam com a prioridade certa." />
            <Feature icon={<ShieldCheck size={20} />} title="Acesso seguro" text="Cada família acompanha a turma com sua própria conta." />
          </div>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-[#75869a] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span className="font-bold text-[#536b84]">Agenda Escolar · 6º C</span>
        <span>Uma rotina escolar mais tranquila, para todos.</span>
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-[#e6edf3] bg-[#fbfcfe] p-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9f1fa] text-[#2e6bad]">{icon}</span>
      <h3 className="mt-4 font-extrabold text-[#314d69]">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-[#718398]">{text}</p>
    </article>
  );
}

function SignedOutLanding() {
  const userQuery = useGetCurrentUser({ query: { retry: false } });
  if (userQuery.data) return <Redirect to="/home" />;
  return <Landing />;
}

function ProtectedPage({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const userQuery = useGetCurrentUser({ query: { retry: false, queryKey: getGetCurrentUserQueryKey() } });
  if (userQuery.isLoading) return <PageLoading label="Preparando sua agenda" />;
  if (userQuery.isError) {
    const status = (userQuery.error as { status?: number } | null)?.status;
    if (status === 401 || status === 403) return <Redirect to="/" />;
    return <ErrorPanel title="Não foi possível carregar seu perfil" description="Confira sua conexão e tente novamente." onRetry={() => userQuery.refetch()} />;
  }
  if (!userQuery.data) return <PageLoading label="Preparando sua agenda" />;
  if (adminOnly && userQuery.data.role !== 'admin') return <Redirect to="/home" />;
  return <AppShell user={userQuery.data}>{children}</AppShell>;
}

function AppShell({ user, children }: { user: SchoolUser; children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const client = useQueryClient();
  const [logoutError, setLogoutError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const nav = [
    { href: '/home', title: 'Início', icon: BookOpen },
    { href: '/agenda', title: 'Agenda', icon: CalendarDays },
    { href: '/avisos', title: 'Avisos', icon: Megaphone },
    ...(user.role === 'admin' ? [{ href: '/admin', title: 'Administração', icon: ShieldCheck }] : []),
  ];
  const userName = user.name?.trim() || user.email.split('@')[0] || 'Minha conta';
  async function handleLogout() {
    setLogoutError('');
    setLoggingOut(true);
    try {
      const response = await fetch(`${basePath}/api/auth/logout`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error('Não foi possível sair. Tente novamente.');
      client.clear();
      setLocation('/');
    } catch {
      setLogoutError('Não foi possível sair. Tente novamente.');
    } finally {
      setLoggingOut(false);
    }
  }
  return (
    <div className="app-shell bg-[#f6f8fb]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-[#e3eaf1] bg-[#f2f6fb] px-4 py-5 lg:flex">
        <Link href="/home" className="flex items-center gap-3 px-2" data-testid="link-sidebar-brand">
          <BrandMark />
          <span className="font-display text-[1.35rem] leading-tight text-[#29445f]">Agenda<br /><span className="text-[#5280ac]">Escolar</span></span>
        </Link>
        <div className="mx-2 mt-8 rounded-2xl border border-[#e1e9f1] bg-white px-4 py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8493a3]">Sua turma</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-extrabold text-[#34516d]">6º C</span>
            <GraduationCap size={17} className="text-[#4d80b5]" />
          </div>
        </div>
        <nav className="mt-7 flex-1 space-y-1.5" aria-label="Navegação principal">
          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#92a0ad]">Menu</p>
          {nav.map(({ href, title, icon: Icon }) => {
            const active = location === href || (href !== '/home' && location.startsWith(`${href}/`));
            return (
              <Link key={href} href={href} data-testid={`nav-${title.toLowerCase().replaceAll(' ', '-')}`} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${active ? 'bg-[#205ca8] text-white shadow-[0_6px_14px_rgba(32,92,168,.15)]' : 'text-[#5d7288] hover:bg-white hover:text-[#2b5f98]'}`}>
                <Icon size={19} strokeWidth={active ? 2.3 : 1.9} /> {title}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/90" />}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-2xl border border-[#e1e9f1] bg-white p-3">
          <div className="flex items-center gap-3 px-1">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8f0f8] text-sm font-extrabold uppercase text-[#32699f]">{userName.slice(0, 1)}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-[#344d67]" data-testid="text-user-name">{userName}</p>
              <p className="truncate text-xs text-[#8492a1]">{user.role === 'admin' ? 'Administrador(a)' : 'Acompanhante da turma'} · @{user.username}</p>
            </div>
          </div>
          {logoutError && <p className="mt-2 px-1 text-xs font-semibold text-[#a5413b]" role="alert">{logoutError}</p>}
          <button type="button" onClick={() => void handleLogout()} disabled={loggingOut} className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-[#6d7f91] transition hover:bg-[#f4f7fa] hover:text-[#b34842] disabled:opacity-60" data-testid="button-sign-out">
            <LogOut size={15} /> {loggingOut ? 'Saindo…' : 'Sair da conta'}
          </button>
        </div>
      </aside>

      <div className="min-h-[100dvh] lg:pl-[252px]">
        <header className="sticky top-0 z-20 border-b border-[#e5ebf1] bg-[#f8fafc]/95 px-4 py-3 backdrop-blur sm:px-7 lg:px-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/home" className="flex items-center gap-2.5 lg:hidden" data-testid="link-mobile-brand">
              <BrandMark />
              <span className="font-display text-lg leading-none text-[#29445f]">Agenda Escolar<span className="ml-1 font-sans text-xs font-bold text-[#8292a3]">· 6º C</span></span>
            </Link>
            <div className="hidden items-center gap-2 text-sm text-[#8593a2] lg:flex">
              <span>Agenda Escolar</span><ChevronRight size={14} /><span className="font-bold text-[#496783]">{navTitle(location)}</span>
            </div>
            <div className="ml-auto hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#617990] ring-1 ring-[#e5ebf1] sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#72ab8c]" /> Turma 6º C
            </div>
            <button type="button" onClick={() => void handleLogout()} disabled={loggingOut} className="ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#6e8194] ring-1 ring-[#e5ebf1] hover:bg-[#fff1ef] hover:text-[#b34842] disabled:opacity-60 lg:hidden" aria-label="Sair da conta" data-testid="button-mobile-sign-out">
              <LogOut size={17} />
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pb-12">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#e2e9f0] bg-white/95 px-1 pb-[max(env(safe-area-inset-bottom),.35rem)] pt-2 backdrop-blur lg:hidden" aria-label="Navegação inferior">
        {nav.map(({ href, title, icon: Icon }) => {
          const active = location === href || (href !== '/home' && location.startsWith(`${href}/`));
          return (
            <Link key={href} href={href} data-testid={`mobile-nav-${title.toLowerCase().replaceAll(' ', '-')}`} className={`flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-extrabold ${active ? 'text-[#205ca8]' : 'text-[#8291a0]'}`}>
              <span className={`grid h-7 w-11 place-items-center rounded-full transition ${active ? 'bg-[#e9f1fa]' : ''}`}><Icon size={19} /></span>
              {title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function navTitle(path: string) {
  if (path.startsWith('/agenda')) return 'Agenda';
  if (path.startsWith('/avisos')) return 'Avisos';
  if (path.startsWith('/admin')) return 'Administração';
  return 'Início';
}

function PageLoading({ label }: { label: string }) {
  return (
    <div className="min-h-[55vh]">
      <div className="h-8 w-44 animate-pulse rounded-lg bg-[#e4ebf2]" />
      <p className="mt-3 text-sm font-semibold text-[#8190a0]" data-testid="status-loading">{label}…</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="h-36 animate-pulse rounded-3xl bg-white ring-1 ring-[#e8edf2]" />
        <div className="h-36 animate-pulse rounded-3xl bg-white ring-1 ring-[#e8edf2]" />
      </div>
      <div className="mt-4 h-52 animate-pulse rounded-3xl bg-white ring-1 ring-[#e8edf2]" />
    </div>
  );
}

function ErrorPanel({ title, description, onRetry }: { title: string; description: string; onRetry: () => void }) {
  return (
    <div className="mx-auto my-12 max-w-lg rounded-3xl border border-[#efd9d7] bg-white p-7 text-center soft-shadow">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0ef] text-[#b4514a]"><CircleAlert size={22} /></span>
      <h2 className="mt-4 font-display text-2xl text-[#344d66]" data-testid="status-error">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#7b8998]">{description}</p>
      <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#205ca8] px-4 py-2.5 text-sm font-extrabold text-white" data-testid="button-retry">
        <RefreshCw size={15} /> Tentar novamente
      </button>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#6686a5]">{eyebrow}</p>
        <h1 className="font-display mt-2 text-4xl leading-tight tracking-[-.02em] text-[#29445f] sm:text-[2.75rem]" data-testid="text-page-title">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#74869a] sm:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}

function StatTile({ icon, label, value, tint }: { icon: ReactNode; label: string; value: number; tint: 'blue' | 'sand' }) {
  const colors = tint === 'blue' ? 'bg-[#eaf2fb] text-[#3575b5]' : 'bg-[#fff5dc] text-[#ad812b]';
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-[#e5ebf1] bg-white p-5 soft-shadow">
      <span className={`grid h-12 w-12 place-items-center rounded-2xl ${colors}`}>{icon}</span>
      <div><p className="text-sm font-bold text-[#7b8c9e]">{label}</p><p className="mt-0.5 text-2xl font-extrabold tracking-tight text-[#304a64]" data-testid={`text-stat-${label.toLowerCase().replaceAll(' ', '-')}`}>{value}</p></div>
    </div>
  );
}

function EmptyState({ icon, title, message }: { icon: ReactNode; title: string; message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#d8e2ec] bg-white px-6 py-12 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f0f5fa] text-[#6d8eae]">{icon}</span>
      <h3 className="mt-4 font-display text-2xl text-[#3c5670]" data-testid="status-empty">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8391a0]">{message}</p>
    </div>
  );
}

function HomePage() {
  const summaryQuery = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });
  if (summaryQuery.isLoading) return <PageLoading label="Carregando o resumo da turma" />;
  if (summaryQuery.isError || !summaryQuery.data) return <ErrorPanel title="O resumo não carregou" description="Tente novamente para ver as novidades da turma." onRetry={() => summaryQuery.refetch()} />;
  const summary = summaryQuery.data;
  const firstName = 'Olá';
  return (
    <div className="rise-in">
      <PageHeading eyebrow="Seu espaço escolar" title={`${firstName}, tudo em dia?`} description="Aqui está o que acontece na turma 6º C. Consulte os detalhes sempre que precisar." />
      <section className="mb-5 grid gap-4 sm:grid-cols-2">
        <StatTile icon={<CalendarDays size={22} />} label="Atividades futuras" value={summary.upcomingCount} tint="blue" />
        <StatTile icon={<Check size={22} />} label="Atividades anteriores" value={summary.pastCount} tint="sand" />
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <article className="overflow-hidden rounded-3xl border border-[#e3eaf1] bg-white soft-shadow">
          <div className="flex items-center justify-between border-b border-[#edf1f5] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf2fb] text-[#3674b2]"><CalendarDays size={19} /></span><div><h2 className="font-extrabold text-[#304a64]">Próxima atividade</h2><p className="text-xs text-[#8493a2]">Seu próximo compromisso escolar</p></div></div>
            <Link href="/agenda" className="hidden items-center gap-1 text-xs font-extrabold text-[#2e6daf] sm:flex" data-testid="link-view-agenda">Ver agenda <ArrowRight size={14} /></Link>
          </div>
          <div className="p-5 sm:p-6">
            {summary.nextActivity ? <ActivitySummary activity={summary.nextActivity} /> : <EmptyState icon={<CalendarDays size={23} />} title="Agenda livre por enquanto" message="Quando uma atividade for publicada, ela aparecerá aqui." />}
          </div>
          <Link href="/agenda" className="flex items-center justify-center gap-2 border-t border-[#edf1f5] py-3.5 text-sm font-extrabold text-[#326eab] hover:bg-[#f8fafc] sm:hidden" data-testid="link-view-agenda-mobile">Abrir agenda <ArrowRight size={15} /></Link>
        </article>
        <article className="overflow-hidden rounded-3xl border border-[#e3eaf1] bg-white soft-shadow">
          <div className="flex items-center justify-between border-b border-[#edf1f5] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff5dc] text-[#ae8129]"><Megaphone size={19} /></span><div><h2 className="font-extrabold text-[#304a64]">Último aviso</h2><p className="text-xs text-[#8493a2]">Recados importantes da turma</p></div></div>
            <Link href="/avisos" className="grid h-9 w-9 place-items-center rounded-full text-[#7d8fa1] hover:bg-[#f3f6f9]" aria-label="Ver todos os avisos" data-testid="link-view-announcements"><ArrowDownRight size={18} /></Link>
          </div>
          <div className="p-5 sm:p-6">
            {summary.latestAnnouncement ? <AnnouncementSummary announcement={summary.latestAnnouncement} /> : <EmptyState icon={<Bell size={22} />} title="Nenhum aviso novo" message="Os recados publicados pela escola aparecerão neste espaço." />}
          </div>
          <Link href="/avisos" className="flex items-center justify-center gap-2 border-t border-[#edf1f5] py-3.5 text-sm font-extrabold text-[#326eab] hover:bg-[#f8fafc]" data-testid="link-all-announcements">Todos os avisos <ArrowRight size={15} /></Link>
        </article>
      </section>
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#e6edf3] bg-[#f1f6fb] px-4 py-3.5 text-sm text-[#637b93]">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#5280ac]"><ShieldCheck size={18} /></span>
        <p>Uma agenda compartilhada para alunos e responsáveis acompanharem a mesma informação.</p>
      </div>
    </div>
  );
}

function ActivitySummary({ activity }: { activity: Activity }) {
  return (
    <div className="flex gap-4" data-testid={`card-next-activity-${activity.id}`}>
      <div className="min-w-[62px] rounded-2xl bg-[#eaf2fb] px-2 py-3 text-center text-[#2865a7]">
        <span className="block text-[10px] font-extrabold uppercase tracking-widest">{weekday(activity.dueDate)}</span>
        <span className="font-display text-3xl leading-9">{dayNumber(activity.dueDate)}</span>
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <span className="inline-flex rounded-full bg-[#f0f5fa] px-2.5 py-1 text-[11px] font-extrabold text-[#53718e]">{activity.subject}</span>
        <h3 className="mt-2 text-lg font-extrabold leading-snug text-[#304b65]">{activity.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#7d8d9d]">{activity.description || 'Sem descrição adicional.'}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#8190a0]"><Clock3 size={14} /> Entrega em {formatDate(activity.dueDate, true)}</p>
      </div>
    </div>
  );
}

function AnnouncementSummary({ announcement }: { announcement: Announcement }) {
  return (
    <div data-testid={`card-latest-announcement-${announcement.id}`}>
      {announcement.priority === 'important' && <span className="mb-3 inline-flex rounded-full bg-[#fff2db] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#98712b]">Importante</span>}
      <h3 className="font-display text-2xl leading-tight text-[#304b65]">{announcement.title}</h3>
      <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 text-[#74869a]">{announcement.content}</p>
      <p className="mt-4 text-xs font-bold text-[#9aa6b2]">{formatDate(announcement.createdAt)}</p>
    </div>
  );
}

function AgendaPage() {
  const query = useListActivities({ query: { queryKey: getListActivitiesQueryKey() } });
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  if (query.isLoading) return <PageLoading label="Buscando as atividades" />;
  if (query.isError || !query.data) return <ErrorPanel title="A agenda não carregou" description="Não conseguimos consultar as atividades agora." onRetry={() => query.refetch()} />;
  const now = Date.now();
  const activities = [...query.data].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const upcoming = activities.filter((activity) => new Date(activity.dueDate).getTime() >= now);
  const past = activities.filter((activity) => new Date(activity.dueDate).getTime() < now).reverse();
  const shown = filter === 'upcoming' ? upcoming : past;
  return (
    <div className="rise-in">
      <PageHeading eyebrow="Planeje sua semana" title="Agenda da turma" description="Atividades organizadas pela data de entrega, para você se preparar com tranquilidade." />
      <div className="mb-5 flex w-fit rounded-xl border border-[#e3eaf1] bg-white p-1">
        {(['upcoming', 'past'] as const).map((key) => (
          <button key={key} type="button" onClick={() => setFilter(key)} className={`rounded-lg px-4 py-2.5 text-sm font-extrabold transition ${filter === key ? 'bg-[#205ca8] text-white shadow-sm' : 'text-[#728499] hover:bg-[#f4f7fa]'}`} data-testid={`button-filter-${key}`}>
            {key === 'upcoming' ? `A seguir · ${upcoming.length}` : `Anteriores · ${past.length}`}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="space-y-3">
          {shown.map((activity) => <ActivityCard key={activity.id} activity={activity} past={filter === 'past'} />)}
        </div>
      ) : (
        <EmptyState icon={<CalendarDays size={23} />} title={filter === 'upcoming' ? 'Nenhuma atividade futura' : 'Ainda não há atividades anteriores'} message={filter === 'upcoming' ? 'Por enquanto, não há deveres ou entregas marcados. Volte para conferir as novidades.' : 'As atividades concluídas ficarão guardadas aqui para consulta.'} />
      )}
    </div>
  );
}

function ActivityCard({ activity, past }: { activity: Activity; past: boolean }) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-[#e3eaf1] bg-white p-4 soft-shadow sm:flex-row sm:items-start sm:p-5" data-testid={`card-activity-${activity.id}`}>
      <div className={`flex min-w-[66px] items-center gap-3 rounded-2xl px-3 py-2.5 sm:flex-col sm:gap-0 sm:px-2 sm:py-3 ${past ? 'bg-[#f1f4f6] text-[#7e8c99]' : 'bg-[#eaf2fb] text-[#2865a7]'}`}>
        <span className="text-[10px] font-extrabold uppercase tracking-widest">{weekday(activity.dueDate)}</span>
        <span className="font-display text-2xl leading-7">{dayNumber(activity.dueDate)}</span>
        <span className="text-[10px] font-bold uppercase tracking-wide">{monthName(activity.dueDate)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#f0f5fa] px-2.5 py-1 text-[11px] font-extrabold text-[#53718e]">{activity.subject}</span>
          {past && <span className="rounded-full bg-[#f2f4f5] px-2.5 py-1 text-[10px] font-extrabold text-[#82909d]">Concluída</span>}
        </div>
        <h2 className="mt-2 text-lg font-extrabold leading-snug text-[#304b65]">{activity.title}</h2>
        {activity.description && <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[#77899b]">{activity.description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#8593a1] sm:pt-1"><Clock3 size={14} /> {formatDate(activity.dueDate, true)}</div>
    </article>
  );
}

function AnnouncementsPage() {
  const query = useListAnnouncements({ query: { queryKey: getListAnnouncementsQueryKey() } });
  if (query.isLoading) return <PageLoading label="Buscando os avisos" />;
  if (query.isError || !query.data) return <ErrorPanel title="Os avisos não carregaram" description="Tente novamente para consultar os recados da turma." onRetry={() => query.refetch()} />;
  const announcements = [...query.data].sort((a, b) => {
    const prioritySort = Number(b.priority === 'important') - Number(a.priority === 'important');
    return prioritySort || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return (
    <div className="rise-in">
      <PageHeading eyebrow="Recados da escola" title="Avisos da turma" description="Informações compartilhadas com alunos e responsáveis do 6º C." />
      {announcements.length ? <div className="grid gap-4 md:grid-cols-2">{announcements.map((item) => <AnnouncementCard key={item.id} announcement={item} />)}</div> : <EmptyState icon={<Megaphone size={23} />} title="Nenhum aviso publicado" message="Quando houver novidades para a turma, você encontrará tudo aqui." />}
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const important = announcement.priority === 'important';
  return (
    <article className={`relative overflow-hidden rounded-3xl border bg-white p-5 soft-shadow sm:p-6 ${important ? 'border-[#f0e1bf]' : 'border-[#e3eaf1]'}`} data-testid={`card-announcement-${announcement.id}`}>
      <span className={`absolute left-0 top-0 h-full w-1 ${important ? 'bg-[#d4a84a]' : 'bg-[#81a5c9]'}`} />
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.1em] ${important ? 'bg-[#fff5df] text-[#98712b]' : 'bg-[#edf3f9] text-[#597896]'}`}>
          {important ? <CircleAlert size={12} /> : <Megaphone size={12} />}
          {important ? 'Importante' : 'Aviso'}
        </span>
        <span className="text-xs font-bold text-[#99a5b1]">{formatDate(announcement.createdAt)}</span>
      </div>
      <h2 className="font-display mt-4 text-2xl leading-tight text-[#304b65]">{announcement.title}</h2>
      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#718397]">{announcement.content}</p>
    </article>
  );
}

function AdminPage() {
  const client = useQueryClient();
  const activitiesQuery = useListActivities({ query: { queryKey: getListActivitiesQueryKey() } });
  const announcementsQuery = useListAnnouncements({ query: { queryKey: getListAnnouncementsQueryKey() } });
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const [activityEditor, setActivityEditor] = useState<Activity | null | 'new'>(null);
  const [announcementEditor, setAnnouncementEditor] = useState<Announcement | null | 'new'>(null);
  const [message, setMessage] = useState('');
  const pending = createActivity.isPending || updateActivity.isPending || deleteActivity.isPending || createAnnouncement.isPending || updateAnnouncement.isPending || deleteAnnouncement.isPending;

  const closeEditors = () => {
    setActivityEditor(null);
    setAnnouncementEditor(null);
    setMessage('');
  };
  const saveActivity = (values: { title: string; description: string; subject: string; dueDate: string }) => {
    setMessage('');
    const data = { ...values, dueDate: new Date(values.dueDate).toISOString() };
    const onSuccess = () => {
      void client.invalidateQueries({ queryKey: getListActivitiesQueryKey() });
      void client.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      closeEditors();
    };
    const onError = () => setMessage('Não foi possível salvar a atividade. Revise os campos e tente novamente.');
    if (activityEditor && activityEditor !== 'new') updateActivity.mutate({ id: activityEditor.id, data }, { onSuccess, onError });
    else createActivity.mutate({ data }, { onSuccess, onError });
  };
  const saveAnnouncement = (values: { title: string; content: string; priority: 'normal' | 'important' }) => {
    setMessage('');
    const onSuccess = () => {
      void client.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
      void client.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      closeEditors();
    };
    const onError = () => setMessage('Não foi possível salvar o aviso. Revise os campos e tente novamente.');
    if (announcementEditor && announcementEditor !== 'new') updateAnnouncement.mutate({ id: announcementEditor.id, data: values }, { onSuccess, onError });
    else createAnnouncement.mutate({ data: values }, { onSuccess, onError });
  };
  const removeActivity = (activity: Activity) => {
    if (!window.confirm(`Excluir a atividade “${activity.title}”?`)) return;
    deleteActivity.mutate({ id: activity.id }, {
      onSuccess: () => {
        void client.invalidateQueries({ queryKey: getListActivitiesQueryKey() });
        void client.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      },
      onError: () => setMessage('Não foi possível excluir a atividade. Tente novamente.'),
    });
  };
  const removeAnnouncement = (announcement: Announcement) => {
    if (!window.confirm(`Excluir o aviso “${announcement.title}”?`)) return;
    deleteAnnouncement.mutate({ id: announcement.id }, {
      onSuccess: () => {
        void client.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        void client.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      },
      onError: () => setMessage('Não foi possível excluir o aviso. Tente novamente.'),
    });
  };
  if (activitiesQuery.isLoading || announcementsQuery.isLoading) return <PageLoading label="Carregando conteúdo para administrar" />;
  if (activitiesQuery.isError || announcementsQuery.isError || !activitiesQuery.data || !announcementsQuery.data) return <ErrorPanel title="Não foi possível abrir a administração" description="Confira a conexão e tente novamente." onRetry={() => { void activitiesQuery.refetch(); void announcementsQuery.refetch(); }} />;
  const activities = [...activitiesQuery.data].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const announcements = [...announcementsQuery.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return (
    <div className="rise-in">
      <PageHeading eyebrow="Área de gestão" title="Administração" description="Publique e mantenha atualizados os conteúdos da turma 6º C." />
      {message && <p className="mb-4 rounded-xl border border-[#efd9d7] bg-[#fff6f5] px-4 py-3 text-sm font-bold text-[#a54842]" role="alert" data-testid="status-admin-error">{message}</p>}
      {pending && <p className="mb-4 rounded-xl bg-[#eaf2fb] px-4 py-3 text-sm font-bold text-[#3e6f9f]" data-testid="status-saving">Salvando alterações…</p>}
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="overflow-hidden rounded-3xl border border-[#e3eaf1] bg-white soft-shadow">
          <div className="flex items-center justify-between gap-3 border-b border-[#edf1f5] px-5 py-4">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf2fb] text-[#3674b2]"><CalendarDays size={19} /></span><div><h2 className="font-extrabold text-[#304a64]">Atividades</h2><p className="text-xs text-[#8694a2]">{activities.length} publicadas</p></div></div>
            <button type="button" onClick={() => { setMessage(''); setActivityEditor('new'); }} className="inline-flex items-center gap-1.5 rounded-xl bg-[#205ca8] px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#184d91]" data-testid="button-create-activity"><Plus size={15} /> Nova</button>
          </div>
          <div className="divide-y divide-[#edf1f5]">
            {activities.length ? activities.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-4" data-testid={`admin-activity-${item.id}`}>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6686a4]">{item.subject} · {formatDate(item.dueDate)}</span>
                  <p className="mt-1 font-extrabold text-[#38516b]">{item.title}</p>
                  {item.description && <p className="mt-1 line-clamp-1 text-xs text-[#8a98a6]">{item.description}</p>}
                </div>
                <button type="button" aria-label={`Editar ${item.title}`} onClick={() => { setMessage(''); setActivityEditor(item); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#6e8297] hover:bg-[#edf3f9] hover:text-[#2b65a4]" data-testid={`button-edit-activity-${item.id}`}><Pencil size={15} /></button>
                <button type="button" aria-label={`Excluir ${item.title}`} onClick={() => removeActivity(item)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#9a7774] hover:bg-[#fff0ef] hover:text-[#b34842]" data-testid={`button-delete-activity-${item.id}`}><Trash2 size={15} /></button>
              </div>
            )) : <div className="p-4"><EmptyState icon={<CalendarDays size={22} />} title="Nenhuma atividade ainda" message="Publique a primeira atividade para a turma." /></div>}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#e3eaf1] bg-white soft-shadow">
          <div className="flex items-center justify-between gap-3 border-b border-[#edf1f5] px-5 py-4">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff5dc] text-[#ae8129]"><Megaphone size={19} /></span><div><h2 className="font-extrabold text-[#304a64]">Avisos</h2><p className="text-xs text-[#8694a2]">{announcements.length} publicados</p></div></div>
            <button type="button" onClick={() => { setMessage(''); setAnnouncementEditor('new'); }} className="inline-flex items-center gap-1.5 rounded-xl bg-[#205ca8] px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#184d91]" data-testid="button-create-announcement"><Plus size={15} /> Novo</button>
          </div>
          <div className="divide-y divide-[#edf1f5]">
            {announcements.length ? announcements.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-4" data-testid={`admin-announcement-${item.id}`}>
                <div className="min-w-0 flex-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${item.priority === 'important' ? 'text-[#a47a28]' : 'text-[#6686a4]'}`}>{item.priority === 'important' ? 'Importante' : 'Aviso'} · {formatDate(item.createdAt)}</span>
                  <p className="mt-1 font-extrabold text-[#38516b]">{item.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-[#8a98a6]">{item.content}</p>
                </div>
                <button type="button" aria-label={`Editar ${item.title}`} onClick={() => { setMessage(''); setAnnouncementEditor(item); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#6e8297] hover:bg-[#edf3f9] hover:text-[#2b65a4]" data-testid={`button-edit-announcement-${item.id}`}><Pencil size={15} /></button>
                <button type="button" aria-label={`Excluir ${item.title}`} onClick={() => removeAnnouncement(item)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#9a7774] hover:bg-[#fff0ef] hover:text-[#b34842]" data-testid={`button-delete-announcement-${item.id}`}><Trash2 size={15} /></button>
              </div>
            )) : <div className="p-4"><EmptyState icon={<Megaphone size={22} />} title="Nenhum aviso ainda" message="Publique um recado para manter todos informados." /></div>}
          </div>
        </section>
      </div>
      {activityEditor !== null && <ActivityEditor activity={activityEditor === 'new' ? null : activityEditor} pending={createActivity.isPending || updateActivity.isPending} onClose={closeEditors} onSave={saveActivity} />}
      {announcementEditor !== null && <AnnouncementEditor announcement={announcementEditor === 'new' ? null : announcementEditor} pending={createAnnouncement.isPending || updateAnnouncement.isPending} onClose={closeEditors} onSave={saveAnnouncement} />}
    </div>
  );
}

function DialogFrame({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1b2f44]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-[1.75rem] bg-white p-5 shadow-[0_28px_80px_rgba(21,42,65,.2)] sm:rounded-[1.75rem] sm:p-7" role="dialog" aria-modal="true" aria-label={title}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#6a88a5]">Turma 6º C</p><h2 className="font-display mt-1 text-3xl text-[#304b65]">{title}</h2></div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-full bg-[#f2f5f8] text-[#718396] hover:bg-[#e7edf3]" data-testid="button-close-dialog"><X size={18} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ActivityEditor({ activity, pending, onClose, onSave }: { activity: Activity | null; pending: boolean; onClose: () => void; onSave: (values: { title: string; description: string; subject: string; dueDate: string }) => void }) {
  const [title, setTitle] = useState(activity?.title ?? '');
  const [subject, setSubject] = useState(activity?.subject ?? '');
  const [description, setDescription] = useState(activity?.description ?? '');
  const [dueDate, setDueDate] = useState(activity ? inputDate(activity.dueDate) : '');
  const [error, setError] = useState('');
  return (
    <DialogFrame title={activity ? 'Editar atividade' : 'Nova atividade'} onClose={onClose}>
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim() || !subject.trim() || !dueDate) { setError('Preencha o título, a matéria e a data de entrega.'); return; }
        setError('');
        onSave({ title: title.trim(), subject: subject.trim(), description: description.trim(), dueDate });
      }} className="space-y-4">
        <Field label="Nome da atividade"><input maxLength={160} required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Exercícios da unidade 3" className="form-input" data-testid="input-activity-title" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Matéria"><input maxLength={80} required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex.: Ciências" className="form-input" data-testid="input-activity-subject" /></Field>
          <Field label="Data e hora de entrega"><input required type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="form-input" data-testid="input-activity-due-date" /></Field>
        </div>
        <Field label="Orientações"><textarea maxLength={5000} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes que ajudam a turma a se preparar..." className="form-input resize-y" data-testid="input-activity-description" /></Field>
        {error && <p className="text-sm font-bold text-[#b34842]" role="alert">{error}</p>}
        <div className="flex flex-col-reverse gap-2 border-t border-[#edf1f5] pt-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-3 text-sm font-bold text-[#6d7f91] hover:bg-[#f3f6f9]" data-testid="button-cancel-activity">Cancelar</button>
          <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#205ca8] px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60" data-testid="button-save-activity">{pending ? 'Salvando…' : 'Salvar atividade'} <Check size={16} /></button>
        </div>
      </form>
    </DialogFrame>
  );
}

function AnnouncementEditor({ announcement, pending, onClose, onSave }: { announcement: Announcement | null; pending: boolean; onClose: () => void; onSave: (values: { title: string; content: string; priority: 'normal' | 'important' }) => void }) {
  const [title, setTitle] = useState(announcement?.title ?? '');
  const [content, setContent] = useState(announcement?.content ?? '');
  const [priority, setPriority] = useState<'normal' | 'important'>(announcement?.priority ?? 'normal');
  const [error, setError] = useState('');
  return (
    <DialogFrame title={announcement ? 'Editar aviso' : 'Novo aviso'} onClose={onClose}>
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim() || !content.trim()) { setError('Preencha o título e a mensagem do aviso.'); return; }
        setError('');
        onSave({ title: title.trim(), content: content.trim(), priority });
      }} className="space-y-4">
        <Field label="Título do aviso"><input maxLength={160} required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Reunião de responsáveis" className="form-input" data-testid="input-announcement-title" /></Field>
        <Field label="Mensagem"><textarea maxLength={5000} rows={5} required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escreva as informações importantes para a turma..." className="form-input resize-y" data-testid="input-announcement-content" /></Field>
        <Field label="Prioridade">
          <select value={priority} onChange={(e) => setPriority(e.target.value as 'normal' | 'important')} className="form-input" data-testid="select-announcement-priority">
            <option value="normal">Aviso</option>
            <option value="important">Importante</option>
          </select>
        </Field>
        {error && <p className="text-sm font-bold text-[#b34842]" role="alert">{error}</p>}
        <div className="flex flex-col-reverse gap-2 border-t border-[#edf1f5] pt-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-3 text-sm font-bold text-[#6d7f91] hover:bg-[#f3f6f9]" data-testid="button-cancel-announcement">Cancelar</button>
          <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#205ca8] px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60" data-testid="button-save-announcement">{pending ? 'Salvando…' : 'Salvar aviso'} <Check size={16} /></button>
        </div>
      </form>
    </DialogFrame>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-[#526a81]">{label}</span>{children}</label>;
}

function PageRouter() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Switch>
        <Route path="/" component={SignedOutLanding} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/home"><ProtectedPage><HomePage /></ProtectedPage></Route>
        <Route path="/agenda"><ProtectedPage><AgendaPage /></ProtectedPage></Route>
        <Route path="/avisos"><ProtectedPage><AnnouncementsPage /></ProtectedPage></Route>
        <Route path="/admin"><ProtectedPage adminOnly><AdminPage /></ProtectedPage></Route>
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PageRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AppRoutes />
    </WouterRouter>
  );
}

function formatDate(value: string, includeTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data a confirmar';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

function dateForCalendar(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60_000);
}

function weekday(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(dateForCalendar(value)).replace('.', '');
}

function dayNumber(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(dateForCalendar(value));
}

function monthName(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(dateForCalendar(value)).replace('.', '');
}

function inputDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export default App;
