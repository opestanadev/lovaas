import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLovaas } from "@/lib/lovaas-store";
import type { Role } from "@/lib/lovaas-data";
import logoAsset from "@/assets/lovaas-logo.png.asset.json";

export function Logo() {
  return (
    <img
      src={logoAsset.url}
      alt="Lovaas"
      className="h-14 w-auto object-contain"
    />
  );
}

export function TitleRule() {
  return (
    <div className="mt-3 flex justify-center gap-3" aria-hidden>
      <span className="h-1 w-14 rounded-full bg-primary" />
      <span className="h-1 w-14 rounded-full bg-secondary" />
      <span className="h-1 w-14 rounded-full bg-accent" />
      <span className="h-1 w-14 rounded-full bg-secondary" />
    </div>
  );
}

function ProfileMenu() {
  const { usuario, logout } = useLovaas();
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!usuario) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-haspopup="menu"
        className="flex items-center gap-3 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-primary-foreground transition hover:bg-primary-foreground/25"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/30 text-sm font-bold">
          {usuario.nome
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-sm font-semibold">{usuario.nome}</span>
          <span className="block text-xs opacity-80">{usuario.cargo}</span>
        </span>
        <span aria-hidden className="text-xs">
          ▾
        </span>
      </button>
      {aberto && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        >
          <Link
            to="/configuracoes"
            onClick={() => setAberto(false)}
            className="block px-4 py-3 text-sm hover:bg-muted"
            role="menuitem"
          >
            Configurações
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="block w-full px-4 py-3 text-left text-sm text-destructive hover:bg-muted"
          >
            Sair da conta
          </button>
        </div>
      )}
    </div>
  );
}

export function AppShell({ children, permitir }: { children: ReactNode; permitir?: Role }) {
  const { usuario, hidratado } = useLovaas();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hidratado) return;
    if (!usuario) navigate({ to: "/" });
    else if (permitir && usuario.role !== permitir)
      navigate({ to: usuario.role === "enfermeiro" ? "/enfermeiro" : "/profissional" });
  }, [hidratado, usuario, permitir, navigate]);

  if (!hidratado || !usuario || (permitir && usuario.role !== permitir)) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando…</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-4 pt-4">
        <header className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-primary px-5 py-2.5">
          <Link to={usuario.role === "enfermeiro" ? "/enfermeiro" : "/profissional"}>
            <Logo />
          </Link>
          <ProfileMenu />
        </header>
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="mt-8 bg-primary py-3 text-center text-xs text-primary-foreground/90">
        Lovaas — Gestão do cuidado à pessoa com TEA · Crateús-CE · ConectaEEEP © Todos os direitos reservados
      </footer>
    </div>
  );
}

export function PageTitle({ children, cor = "primary" }: { children: ReactNode; cor?: "primary" | "secondary" }) {
  return (
    <div className="mb-8 text-center">
      <h1 className={cor === "primary" ? "text-3xl text-primary" : "text-3xl text-secondary"}>{children}</h1>
      <TitleRule />
    </div>
  );
}

export function StatusBadge({ status }: { status: "pendente" | "concluida" | "ausente" }) {
  const mapa = {
    pendente: { texto: "Pendente", classe: "bg-warning text-warning-foreground" },
    concluida: { texto: "Concluída", classe: "bg-success text-success-foreground" },
    ausente: { texto: "Paciente ausente", classe: "bg-destructive text-destructive-foreground" },
  } as const;
  const item = mapa[status];
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${item.classe}`}>{item.texto}</span>
  );
}

export function formatarData(iso: string) {
  if (!iso) return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");
}
