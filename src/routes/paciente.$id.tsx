import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageTitle, StatusBadge, formatarData } from "@/components/Layout";
import { gerarResumoIA, useLovaas } from "@/lib/lovaas-store";
import { ESPECIALIDADES, SERVICOS, type Especialidade, type Paciente, type Prioridade } from "@/lib/lovaas-data";

export const Route = createFileRoute("/paciente/$id")({
  head: () => ({
    meta: [
      { title: "Prontuário integrado — Lovaas" },
      { name: "description", content: "Prontuário integrado, resumo clínico e histórico multidisciplinar do paciente." },
      { property: "og:title", content: "Prontuário integrado — Lovaas" },
      { property: "og:description", content: "Histórico contínuo e integrado da rede de cuidado a pessoas com TEA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PacientePage,
});

function PacientePage() {
  const { id } = Route.useParams();
  const { usuario, getPaciente, consultasDoPaciente, criarEncaminhamento, atualizarPaciente, marcarAusencia } = useLovaas();
  const navigate = useNavigate();
  const paciente = getPaciente(id);
  const consultas = consultasDoPaciente(id);
  const [encaminhar, setEncaminhar] = useState(false);
  const [especialidade, setEspecialidade] = useState<Especialidade>("Psicologia");
  const [prioridade, setPrioridade] = useState<Prioridade>("Curto prazo");
  const [motivo, setMotivo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editando, setEditando] = useState(false);
  const [aps, setAps] = useState(paciente?.aps ?? "");
  const [servico, setServico] = useState<Paciente["servico"]>(paciente?.servico ?? "NASF");

  if (!paciente) {
    return <AppShell><p className="py-20 text-center">Paciente não encontrado.</p></AppShell>;
  }

  const pacienteAtual = paciente;

  const consultaHoje = consultas.find((c) => c.status === "pendente" && c.profissionalId === usuario?.id && c.data === new Date().toISOString().slice(0, 10));

  function enviarEncaminhamento(e: React.FormEvent) {
    e.preventDefault();
    const r = criarEncaminhamento({ pacienteId: pacienteAtual.id, especialidade, prioridade, motivo });
    if (!r.ok) {
      setMensagem(r.erro ?? "Não foi possível encaminhar.");
      return;
    }
    setMensagem(`Encaminhamento priorizado para ${formatarData(r.consulta?.data ?? "")} às ${r.consulta?.hora}.`);
    setMotivo("");
  }

  return (
    <AppShell>
      <PageTitle cor="secondary">{paciente.nome}</PageTitle>
      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <section className="rounded-3xl bg-surface p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Info label="CPF" value={paciente.cpf} />
              <Info label="Prontuário" value={paciente.prontuario} />
              <Info label="Data de nascimento" value={formatarData(paciente.nascimento)} />
              <Info label="CNS" value={paciente.cns || "Não informado"} />
              <Info label="Situação clínica" value={`${paciente.hd} — ${paciente.nivelTEA}`} />
              <Info label="Condições associadas" value={paciente.condicoes.join(", ") || "Nenhuma registrada"} />
              <Info label="Endereço" value={`${paciente.endereco}, Nº ${paciente.numero} — ${paciente.bairro}`} />
              <Info label="Município" value={`${paciente.municipio} - ${paciente.estado}`} />
              <Info label="Responsável" value={`${paciente.responsavelNome} · ${paciente.telefone}`} />
              <Info label="Rede de referência" value={`${paciente.aps} · ${paciente.servico}`} />
            </div>

            {usuario?.role === "enfermeiro" && (
              <div className="mt-6 border-t border-border pt-5">
                {!editando ? (
                  <button type="button" onClick={() => setEditando(true)} className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary">Atualizar região de atendimento</button>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <input value={aps} onChange={(e) => setAps(e.target.value)} className="field-input flex-1" aria-label="APS de referência" />
                    <select value={servico} onChange={(e) => setServico(e.target.value as Paciente["servico"])} className="field-input flex-1" aria-label="Serviço atual">
                      {SERVICOS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button type="button" onClick={() => { atualizarPaciente(paciente.id, { aps, servico }); setEditando(false); }} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Salvar</button>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-primary/10 p-6">
            <h2 className="flex items-center gap-2 text-lg text-primary"><span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">IA</span> Resumo por IA</h2>
            <p className="mt-3 text-sm leading-relaxed">{gerarResumoIA(paciente, consultas)}</p>
            <p className="mt-3 text-xs text-muted-foreground">Apoio à decisão clínica. Deve ser validado pelo profissional responsável.</p>
          </section>

          <div className="flex flex-wrap gap-3">
            {usuario?.role === "profissional" && consultaHoje ? (
              <>
                <button type="button" onClick={() => navigate({ to: "/consulta/$id", params: { id: consultaHoje.id } })} className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Realizar consulta de hoje</button>
                <button type="button" onClick={() => marcarAusencia(consultaHoje.id)} className="rounded-full border border-destructive px-6 py-3 font-bold text-destructive">Registrar ausência</button>
              </>
            ) : (
              <button type="button" onClick={() => setEncaminhar((v) => !v)} className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Encaminhamento</button>
            )}
          </div>

          {encaminhar && (
            <form onSubmit={enviarEncaminhamento} className="rounded-3xl bg-surface p-6">
              <h2 className="text-lg text-primary">Novo encaminhamento</h2>
              <p className="mt-1 text-xs text-muted-foreground">A data será definida pelo algoritmo conforme prioridade, nível de suporte e vagas disponíveis.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label><span className="field-label">Especialidade</span><select value={especialidade} onChange={(e) => setEspecialidade(e.target.value as Especialidade)} className="field-input">{ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}</select></label>
                <label><span className="field-label">Prioridade</span><select value={prioridade} onChange={(e) => setPrioridade(e.target.value as Prioridade)} className="field-input"><option>Urgente</option><option>Curto prazo</option><option>Lista de espera</option></select></label>
                <label className="sm:col-span-2"><span className="field-label">Motivo do encaminhamento</span><textarea required value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3} className="area-input" /></label>
              </div>
              {mensagem && <p role="status" className={`mt-3 text-sm font-semibold ${mensagem.startsWith("Duplicidade") ? "text-destructive" : "text-success"}`}>{mensagem}</p>}
              <button type="submit" className="mt-4 rounded-full bg-secondary px-6 py-2.5 font-bold text-secondary-foreground">Priorizar e agendar</button>
            </form>
          )}
        </div>

        <aside className="self-start rounded-3xl bg-secondary p-5 text-secondary-foreground">
          <h2 className="text-xl">Histórico de consultas</h2>
          <div className="mt-4 space-y-3">
            {consultas.map((c) => (
              <Link key={c.id} to="/consulta/$id" params={{ id: c.id }} className="block rounded-2xl bg-card p-4 text-card-foreground hover:ring-2 hover:ring-primary">
                <strong className="block">{c.especialidade}</strong>
                <span className="block text-xs text-muted-foreground">{formatarData(c.data)} · {c.hora} · {c.servico}</span>
                <span className="mt-2 block"><StatusBadge status={c.status} /></span>
              </Link>
            ))}
            {consultas.length === 0 && <p className="text-sm opacity-80">Sem consultas registradas.</p>}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold uppercase text-muted-foreground">{label}</p><p className="text-sm">{value}</p></div>;
}
