import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageTitle } from "@/components/Layout";
import { useLovaas } from "@/lib/lovaas-store";
import { SERVICOS, type Paciente } from "@/lib/lovaas-data";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastrar paciente — Lovaas Crateús" },
      { name: "description", content: "Cadastro único de paciente com verificação automática de duplicidade por CPF." },
      { property: "og:title", content: "Cadastrar paciente — Lovaas" },
      { property: "og:description", content: "Cadastro único e integrado da rede de cuidado à pessoa com TEA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell permitir="enfermeiro">
      <Cadastro />
    </AppShell>
  ),
});

const inicial: Omit<Paciente, "id"> = {
  prontuario: "",
  hd: "",
  dataAbertura: new Date().toISOString().slice(0, 10),
  nome: "",
  cpf: "",
  cns: "",
  nascimento: "",
  nomeMae: "",
  telefone: "",
  sexo: "",
  cor: "",
  endereco: "",
  numero: "",
  bairro: "",
  aps: "",
  municipio: "Crateús",
  estado: "Ceará",
  responsavelNome: "",
  responsavelCns: "",
  responsavelNascimento: "",
  nivelTEA: "Nível 1",
  condicoes: [],
  servico: "NASF",
};

function Cadastro() {
  const { cadastrarPaciente } = useLovaas();
  const navigate = useNavigate();
  const [dados, setDados] = useState(inicial);
  const [condicoes, setCondicoes] = useState("");
  const [erro, setErro] = useState("");

  function campo<K extends keyof typeof dados>(chave: K, valor: (typeof dados)[K]) {
    setDados((d) => ({ ...d, [chave]: valor }));
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const resultado = cadastrarPaciente({
      ...dados,
      nome: dados.nome.toUpperCase(),
      condicoes: condicoes
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
    if (!resultado.ok) {
      setErro(resultado.erro ?? "Não foi possível cadastrar.");
      return;
    }
    if (resultado.id) navigate({ to: "/paciente/$id", params: { id: resultado.id } });
  }

  return (
    <>
      <PageTitle>Cadastro</PageTitle>
      <form onSubmit={enviar} className="mx-auto max-w-4xl rounded-3xl bg-surface p-6 md:p-9">
        <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
          <Input label="Nº do Prontuário" required value={dados.prontuario} onChange={(v) => campo("prontuario", v)} />
          <Input label="CPF" required value={dados.cpf} onChange={(v) => campo("cpf", v)} placeholder="000.000.000-00" />
          <Input label="Hipótese Diagnóstica (H.D.)" required value={dados.hd} onChange={(v) => campo("hd", v)} />
          <Input label="CNS (opcional)" value={dados.cns} onChange={(v) => campo("cns", v)} />
          <Input label="Data de abertura" required type="date" value={dados.dataAbertura} onChange={(v) => campo("dataAbertura", v)} />
          <Input label="Nome completo" required value={dados.nome} onChange={(v) => campo("nome", v)} />
          <Input label="Data de nascimento" required type="date" value={dados.nascimento} onChange={(v) => campo("nascimento", v)} />
          <Input label="Nome da mãe" required value={dados.nomeMae} onChange={(v) => campo("nomeMae", v)} />
          <Input label="Telefone" required value={dados.telefone} onChange={(v) => campo("telefone", v)} placeholder="(00) 00000-0000" />
          <Select label="Sexo" required value={dados.sexo} onChange={(v) => campo("sexo", v)} options={["Masculino", "Feminino", "Outro", "Prefere não informar"]} />
          <Select label="Cor/raça" required value={dados.cor} onChange={(v) => campo("cor", v)} options={["Branca", "Preta", "Parda", "Amarela", "Indígena"]} />
          <Input label="Endereço" required value={dados.endereco} onChange={(v) => campo("endereco", v)} />
          <Input label="Número" required value={dados.numero} onChange={(v) => campo("numero", v)} />
          <Input label="Bairro" required value={dados.bairro} onChange={(v) => campo("bairro", v)} />
          <Input label="APS (unidade de referência)" required value={dados.aps} onChange={(v) => campo("aps", v)} />
          <Select label="Serviço atual" required value={dados.servico} onChange={(v) => campo("servico", v as Paciente["servico"])} options={SERVICOS} />
          <Input label="Município" required value={dados.municipio} onChange={(v) => campo("municipio", v)} />
          <Input label="Estado" required value={dados.estado} onChange={(v) => campo("estado", v)} />
          <Input label="Nome do(a) responsável" required value={dados.responsavelNome} onChange={(v) => campo("responsavelNome", v)} />
          <Input label="CNS do(a) responsável (opcional)" value={dados.responsavelCns} onChange={(v) => campo("responsavelCns", v)} />
          <Input label="Nascimento do(a) responsável" required type="date" value={dados.responsavelNascimento} onChange={(v) => campo("responsavelNascimento", v)} />
          <Select label="Nível de suporte do TEA" required value={dados.nivelTEA} onChange={(v) => campo("nivelTEA", v as Paciente["nivelTEA"])} options={["Nível 1", "Nível 2", "Nível 3"]} />
          <div className="md:col-span-2">
            <Input label="Outras condições clínicas (separe por vírgula)" value={condicoes} onChange={setCondicoes} />
          </div>
        </div>

        {erro && (
          <div role="alert" className="mt-6 rounded-2xl border border-destructive bg-destructive/10 p-4 text-sm font-semibold text-destructive">
            {erro}
          </div>
        )}

        <div className="mt-8 text-center">
          <button type="submit" className="rounded-full bg-secondary px-8 py-3 font-display font-bold text-secondary-foreground hover:opacity-90">
            Enviar dados
          </button>
        </div>
      </form>
    </>
  );
}

function Input({ label, onChange, ...props }: { label: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <input {...props} onChange={(e) => onChange(e.target.value)} className="field-input" />
    </label>
  );
}

function Select({ label, options, onChange, ...props }: { label: string; options: readonly string[]; onChange: (v: string) => void } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange">) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <select {...props} onChange={(e) => onChange(e.target.value)} className="field-input">
        <option value="">Selecione</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
