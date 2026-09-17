import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageTitle, StatusBadge, formatarData } from "@/components/Layout";
import { useLovaas } from "@/lib/lovaas-store";

export const Route = createFileRoute("/profissional")({
  head: () => ({
    meta: [
      { title: "Cronograma de atendimentos — Lovaas" },
      { name: "description", content: "Agenda diária e semanal priorizada de atendimentos multidisciplinares a pessoas com TEA." },
      { property: "og:title", content: "Cronograma de atendimentos — Lovaas" },
      { property: "og:description", content: "Agenda priorizada, histórico e registro de consultas da rede de Crateús." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell permitir="profissional">
      <Agenda />
    </AppShell>
  ),
});

function Agenda() {
  const { usuario, pacientes, consultas } = useLovaas();
  const [periodo, setPeriodo] = useState<"dia" | "semana">("dia");
  const hoje = new Date().toISOString().slice(0, 10);

  const minhas = useMemo(() => consultas.filter((c) => c.profissionalId === usuario?.id), [consultas, usuario]);
  const agenda = useMemo(() => {
    const limite = new Date();
    limite.setDate(limite.getDate() + 7);
    const limiteIso = limite.toISOString().slice(0, 10);
    return minhas
      .filter((c) => c.status === "pendente" && (periodo === "dia" ? c.data === hoje : c.data >= hoje && c.data <= limiteIso))
      .sort((a, b) => (a.data + a.hora > b.data + b.hora ? 1 : -1));
  }, [minhas, periodo, hoje]);
  const historico = minhas.filter((c) => c.status !== "pendente").sort((a, b) => (a.data < b.data ? 1 : -1));

  return (
    <>
      <PageTitle>Olá, {usuario?.nome}</PageTitle>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl text-secondary">Cronograma de consultas</h2>
            <div className="flex rounded-full bg-surface p-1" aria-label="Filtrar cronograma">
              {(["dia", "semana"] as const).map((p) => (
                <button key={p} type="button" onClick={() => setPeriodo(p)} className={`rounded-full px-5 py-2 text-sm font-semibold ${periodo === p ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {p === "dia" ? "Hoje" : "Próximos 7 dias"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-surface p-5">
            {agenda.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Nenhuma consulta neste período.</p>
            ) : (
              <div className="space-y-3">
                {agenda.map((c) => {
                  const p = pacientes.find((x) => x.id === c.pacienteId);
                  return (
                    <div key={c.id} className="grid grid-cols-[4.5rem_1fr] gap-3">
                      <div className="rounded-2xl bg-primary px-2 py-4 text-center text-primary-foreground">
                        <strong className="block text-lg">{c.hora}</strong>
                        <span className="text-[0.68rem]">{formatarData(c.data)}</span>
                      </div>
                      <Link to="/paciente/$id" params={{ id: c.pacienteId }} className="flex flex-col justify-center rounded-2xl bg-card px-5 py-3 hover:ring-2 hover:ring-secondary">
                        <span className="font-bold">{p?.nome ?? "Paciente"}</span>
                        <span className="text-xs text-muted-foreground">{c.motivo}</span>
                        <span className="mt-1 text-xs font-semibold text-primary">{c.prioridade} · {c.servico}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-3xl bg-secondary p-5 text-secondary-foreground">
          <h2 className="text-xl">Histórico de consultas</h2>
          <div className="mt-4 space-y-3">
            {historico.map((c) => {
              const p = pacientes.find((x) => x.id === c.pacienteId);
              return (
                <Link key={c.id} to="/consulta/$id" params={{ id: c.id }} className="block rounded-2xl bg-card p-4 text-card-foreground hover:ring-2 hover:ring-primary">
                  <strong className="block text-sm">{p?.nome}</strong>
                  <span className="mb-2 block text-xs text-muted-foreground">{formatarData(c.data)} · {c.hora}</span>
                  <StatusBadge status={c.status} />
                </Link>
              );
            })}
            {historico.length === 0 && <p className="text-sm opacity-80">Nenhum atendimento registrado.</p>}
          </div>
        </aside>
      </div>
    </>
  );
}
