import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle } from "@/components/Layout";
import { useLovaas } from "@/lib/lovaas-store";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações da conta — Lovaas" },
      { name: "description", content: "Dados do profissional, permissões de acesso e informações de privacidade (LGPD)." },
      { property: "og:title", content: "Configurações da conta — Lovaas" },
      { property: "og:description", content: "Permissões de acesso e proteção de dados no Lovaas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <Config />
    </AppShell>
  ),
});

const PERMISSOES = {
  enfermeiro: {
    pode: [
      "Cadastrar paciente (com verificação de duplicidade por CPF)",
      "Atualizar dados cadastrais e a região/APS de atendimento",
      "Visualizar histórico de atendimentos",
      "Criar encaminhamentos para a fila multidisciplinar",
    ],
    naoPode: [
      "Alterar registros clínicos feitos pelo profissional",
      "Apagar atendimentos",
      "Alterar avaliação clínica",
    ],
  },
  profissional: {
    pode: [
      "Visualizar cronograma do dia e da semana",
      "Visualizar pacientes encaminhados",
      "Consultar histórico autorizado",
      "Registrar atendimento e avaliação",
      "Fazer encaminhamentos e agendar próximas consultas",
      "Atualizar informações referentes ao seu próprio atendimento",
    ],
    naoPode: [
      "Criar cadastro de paciente sem verificação de duplicidade",
      "Apagar registros anteriores",
      "Alterar registros feitos por outros profissionais",
    ],
  },
} as const;

function Config() {
  const { usuario } = useLovaas();
  if (!usuario) return null;
  const p = PERMISSOES[usuario.role];

  return (
    <>
      <PageTitle>Configurações</PageTitle>
      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl bg-surface p-6">
          <h2 className="text-lg text-primary">Dados da conta</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Info rotulo="Nome" valor={usuario.nome} />
            <Info rotulo="Cargo" valor={usuario.cargo} />
            <Info rotulo="E-mail" valor={usuario.email} />
            <Info rotulo="Unidade" valor={usuario.unidade} />
            {usuario.especialidade && <Info rotulo="Especialidade" valor={usuario.especialidade} />}
          </dl>
        </section>

        <section className="rounded-3xl bg-surface p-6">
          <h2 className="text-lg text-primary">Permissões do seu perfil</h2>
          <h3 className="mt-4 text-sm font-bold text-success">Pode</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {p.pode.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <h3 className="mt-4 text-sm font-bold text-destructive">Não pode</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {p.naoPode.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl bg-surface p-6 md:col-span-2">
          <h2 className="text-lg text-primary">Privacidade e proteção de dados (LGPD)</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            O compartilhamento de informações entre NASF, NAPE, CREAES, Casa Mais Azul e CRASF ocorre apenas para
            garantir a continuidade do cuidado. Todo acesso é vinculado ao login do profissional e registrado com
            autor, data e hora. Registros clínicos não podem ser apagados — apenas complementados pelo autor.
          </p>
        </section>
      </div>
    </>
  );
}

function Info({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-muted-foreground">{rotulo}</dt>
      <dd>{valor}</dd>
    </div>
  );
}
