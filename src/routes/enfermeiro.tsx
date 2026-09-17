import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageTitle } from "@/components/Layout";
import { useLovaas } from "@/lib/lovaas-store";

export const Route = createFileRoute("/enfermeiro")({
  head: () => ({
    meta: [
      { title: "Pacientes cadastrados — Lovaas Crateús" },
      {
        name: "description",
        content: "Lista de pacientes com TEA cadastrados na unidade, fila de encaminhamentos e cadastro sem duplicidade.",
      },
      { property: "og:title", content: "Pacientes cadastrados — Lovaas" },
      { property: "og:description", content: "Fila de atendimento multidisciplinar e cadastro único de pacientes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell permitir="enfermeiro">
      <Home />
    </AppShell>
  ),
});

function Home() {
  const { usuario, pacientes, consultas, filaDoPaciente } = useLovaas();
  const [busca, setBusca] = useState("");

  const lista = useMemo(() => {
    const normalizar = (valor: string) =>
      valor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const q = normalizar(busca.trim());
    const qNumerico = busca.replace(/\D/g, "");
    return pacientes.filter(
      (p) =>
        !q ||
        normalizar(p.nome).includes(q) ||
        (qNumerico.length > 0 &&
          (p.cpf.replace(/\D/g, "").includes(qNumerico) || p.prontuario.includes(qNumerico))),
    );
  }, [pacientes, busca]);

  const indicadores = [
    { rotulo: "Pacientes cadastrados", valor: pacientes.length },
    { rotulo: "Encaminhamentos ativos", valor: consultas.filter((c) => c.status === "pendente").length },
    { rotulo: "Atendimentos concluídos", valor: consultas.filter((c) => c.status === "concluida").length },
    { rotulo: "Faltas registradas", valor: consultas.filter((c) => c.status === "ausente").length },
  ];

  return (
    <>
      <PageTitle>Olá, {usuario?.nome}</PageTitle>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {indicadores.map((i) => (
          <div key={i.rotulo} className="rounded-2xl bg-surface p-4 text-center">
            <p className="font-display text-3xl text-primary">{i.valor}</p>
            <p className="text-xs text-muted-foreground">{i.rotulo}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 flex items-center gap-2 text-lg text-secondary">
        <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs text-secondary-foreground">P</span> Pacientes cadastrados
      </h2>

      <section className="rounded-3xl bg-surface p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar por nome, CPF ou prontuário"
            aria-label="Pesquisar paciente"
            className="field-input sm:flex-1"
          />
          <Link
            to="/cadastro"
            className="rounded-full bg-primary px-5 py-2.5 text-center text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            + Cadastrar
          </Link>
        </div>

        <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {lista.map((p) => {
            const fila = filaDoPaciente(p.id);
            return (
              <Link
                key={p.id}
                to="/paciente/$id"
                params={{ id: p.id }}
                className="flex flex-col gap-2 rounded-2xl bg-card px-5 py-4 transition hover:ring-2 hover:ring-primary sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  <span className="block font-semibold">{p.nome}</span>
                  <span className="block text-xs text-muted-foreground">
                    CPF: {p.cpf} · Prontuário {p.prontuario} · {p.servico}
                  </span>
                </span>
                <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground">
                  Na lista de espera - {fila === 0 ? "Nenhum" : fila}
                </span>
              </Link>
            );
          })}
          {lista.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Nenhum paciente encontrado.</p>
          )}
        </div>
      </section>
    </>
  );
}
