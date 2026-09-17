import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageTitle, StatusBadge, formatarData } from "@/components/Layout";
import { ANAMNESES, type Registro } from "@/lib/lovaas-data";
import { useLovaas } from "@/lib/lovaas-store";

export const Route = createFileRoute("/consulta/$id")({
  head: () => ({
    meta: [
      { title: "Registro de atendimento — Lovaas" },
      { name: "description", content: "Registro clínico estruturado e histórico de atendimento multidisciplinar." },
      { property: "og:title", content: "Registro de atendimento — Lovaas" },
      { property: "og:description", content: "Anamnese, avaliação, conduta e encaminhamentos do atendimento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConsultaPage,
});

function ConsultaPage() {
  const { id } = Route.useParams();
  const { usuario, consultas, getPaciente, registrarAtendimento } = useLovaas();
  const navigate = useNavigate();
  const consulta = consultas.find((c) => c.id === id);
  const paciente = consulta ? getPaciente(consulta.pacienteId) : undefined;
  const modelo = consulta ? ANAMNESES[consulta.especialidade] : undefined;
  const [anamnese, setAnamnese] = useState<Record<string, string>>({});
  const [avaliacaoEstruturada, setAvaliacaoEstruturada] = useState("Evolução parcial");
  const [avaliacaoObs, setAvaliacaoObs] = useState("");
  const [conduta, setConduta] = useState("");
  const [encaminhamento, setEncaminhamento] = useState("Nenhum");
  const [observacoes, setObservacoes] = useState("");
  const [anexos, setAnexos] = useState<string[]>([]);

  if (!consulta || !paciente || !modelo) return <AppShell><p className="py-20 text-center">Consulta não encontrada.</p></AppShell>;

  const podeEditar = usuario?.role === "profissional" && consulta.profissionalId === usuario.id && consulta.status === "pendente";

  function finalizar(e: React.FormEvent) {
    e.preventDefault();
    const registro: Registro = {
      profissional: usuario?.nome ?? consulta.profissionalNome,
      data: new Date().toISOString().slice(0, 10),
      anamnese,
      avaliacaoEstruturada,
      avaliacaoObs,
      conduta,
      encaminhamento,
      observacoes,
      anexos,
    };
    registrarAtendimento(consulta.id, registro);
    navigate({ to: "/paciente/$id", params: { id: paciente.id } });
  }

  return (
    <AppShell>
      <PageTitle>{consulta.especialidade}</PageTitle>
      <div className="mx-auto max-w-4xl">
        <section className="mb-5 rounded-3xl bg-surface p-5">
          <div className="grid gap-4 sm:grid-cols-4">
            <Info label="Paciente" value={paciente.nome} />
            <Info label="Profissional" value={consulta.profissionalNome} />
            <Info label="Data e hora" value={`${formatarData(consulta.data)} · ${consulta.hora}`} />
            <div><p className="text-xs font-bold uppercase text-muted-foreground">Situação</p><StatusBadge status={consulta.status} /></div>
          </div>
          <p className="mt-4 text-sm"><strong>Motivo:</strong> {consulta.motivo}</p>
        </section>

        {consulta.registro ? (
          <RegistroConcluido registro={consulta.registro} />
        ) : consulta.status === "ausente" ? (
          <section className="rounded-3xl bg-destructive/10 p-6 text-center"><h2 className="text-destructive">Paciente ausente</h2><p className="mt-2 text-sm">A ausência foi registrada no histórico e nos indicadores.</p></section>
        ) : !podeEditar ? (
          <section className="rounded-3xl bg-warning/20 p-6 text-center"><h2 className="text-warning-foreground">Registro protegido</h2><p className="mt-2 text-sm">Somente o profissional responsável por este atendimento pode preencher ou alterar o registro.</p></section>
        ) : (
          <form onSubmit={finalizar} className="space-y-5">
            <section className="rounded-3xl bg-surface p-6">
              <h2 className="text-lg text-primary">{modelo.titulo}</h2>
              <p className="mt-1 text-xs text-muted-foreground">Campos adaptados ao instrumento oficial utilizado pelo serviço.</p>
              <div className="mt-5 space-y-4">
                {modelo.campos.map((campo) => (
                  <label key={campo} className="block"><span className="field-label">{campo}</span><textarea required rows={3} value={anamnese[campo] ?? ""} onChange={(e) => setAnamnese((a) => ({ ...a, [campo]: e.target.value }))} className="area-input" /></label>
                ))}
              </div>
            </section>
            <section className="rounded-3xl bg-surface p-6">
              <h2 className="text-lg text-primary">Avaliação e conduta</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label><span className="field-label">Avaliação estruturada</span><select value={avaliacaoEstruturada} onChange={(e) => setAvaliacaoEstruturada(e.target.value)} className="field-input"><option>Evolução positiva</option><option>Evolução parcial</option><option>Sem evolução observada</option><option>Necessita reavaliação</option></select></label>
                <label><span className="field-label">Próximo encaminhamento</span><select value={encaminhamento} onChange={(e) => setEncaminhamento(e.target.value)} className="field-input"><option>Nenhum</option><option>Psicopedagogia</option><option>Terapia Ocupacional</option><option>Fonoaudiologia</option><option>Educação Física Adaptada</option></select></label>
                <label className="sm:col-span-2"><span className="field-label">Observações da avaliação</span><textarea required rows={3} value={avaliacaoObs} onChange={(e) => setAvaliacaoObs(e.target.value)} className="area-input" /></label>
                <label className="sm:col-span-2"><span className="field-label">Conduta adotada</span><textarea required rows={3} value={conduta} onChange={(e) => setConduta(e.target.value)} className="area-input" /></label>
                <label className="sm:col-span-2"><span className="field-label">Observações finais</span><textarea rows={3} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="area-input" /></label>
                <label className="sm:col-span-2"><span className="field-label">Anexos (imagens ou documentos)</span><input type="file" multiple onChange={(e) => setAnexos(Array.from(e.target.files ?? []).map((f) => f.name))} className="block w-full rounded-2xl bg-card p-3 text-sm" />{anexos.length > 0 && <span className="mt-1 block text-xs text-muted-foreground">{anexos.join(", ")}</span>}</label>
              </div>
            </section>
            <button type="submit" className="w-full rounded-full bg-secondary px-8 py-3 font-display font-bold text-secondary-foreground">Finalizar atendimento</button>
          </form>
        )}
        <Link to="/paciente/$id" params={{ id: paciente.id }} className="mt-5 inline-block text-sm font-semibold text-primary">← Voltar ao prontuário</Link>
      </div>
    </AppShell>
  );
}

function RegistroConcluido({ registro }: { registro: Registro }) {
  return (
    <section className="space-y-5 rounded-3xl bg-surface p-6">
      <h2 className="text-lg text-success">Atendimento concluído</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(registro.anamnese).map(([k, v]) => <Info key={k} label={k} value={v} />)}
      </div>
      <div className="border-t border-border pt-4"><Info label="Avaliação" value={`${registro.avaliacaoEstruturada} — ${registro.avaliacaoObs}`} /></div>
      <Info label="Conduta" value={registro.conduta} />
      <Info label="Encaminhamento" value={registro.encaminhamento} />
      <Info label="Observações" value={registro.observacoes || "Sem observações."} />
      <Info label="Anexos" value={registro.anexos.join(", ") || "Nenhum anexo."} />
      <p className="text-xs text-muted-foreground">Registrado por {registro.profissional} em {formatarData(registro.data)}. Este registro não pode ser apagado.</p>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold uppercase text-muted-foreground">{label}</p><p className="whitespace-pre-wrap text-sm">{value}</p></div>;
}