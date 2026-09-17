import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLovaas } from "@/lib/lovaas-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lovaas — Gestão do cuidado a pessoas com TEA em Crateús-CE" },
      {
        name: "description",
        content:
          "Plataforma municipal de Crateús-CE para gestão de filas, prontuário e histórico de atendimento multidisciplinar a pessoas com Transtorno do Espectro Autista.",
      },
      { property: "og:title", content: "Lovaas — Gestão do cuidado a pessoas com TEA" },
      {
        property: "og:description",
        content: "Filas, prontuário único e histórico integrado da rede pública de saúde de Crateús-CE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const { login, usuario, hidratado } = useLovaas();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (hidratado && usuario) {
      navigate({ to: usuario.role === "enfermeiro" ? "/enfermeiro" : "/profissional" });
    }
  }, [hidratado, usuario, navigate]);

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    const r = login(email, senha);
    if (!r.ok) {
      setErro(r.erro ?? "Não foi possível entrar.");
      return;
    }
    setErro("");
  }

  function preencher(tipo: "enf" | "prof") {
    setEmail(tipo === "enf" ? "riquelme@crateus.ce.gov.br" : "pedro@crateus.ce.gov.br");
    setSenha("lovaas123");
    setErro("");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-4 pt-4">
        <header className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-primary px-5 py-2.5">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-lg">
              💜
            </span>
            <span className="font-display text-xl italic text-primary-foreground">Lovaas</span>
          </div>
          <span className="text-xs text-primary-foreground/85">Prefeitura de Crateús · Secretaria de Saúde</span>
        </header>
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:flex-row md:items-stretch">
        <section className="flex-1 self-center">
          <h1 className="text-4xl text-primary">Cuidado organizado para quem precisa.</h1>
          <div className="mt-3 flex gap-3" aria-hidden>
            <span className="h-1 w-14 rounded-full bg-primary" />
            <span className="h-1 w-14 rounded-full bg-secondary" />
            <span className="h-1 w-14 rounded-full bg-accent" />
            <span className="h-1 w-14 rounded-full bg-secondary" />
          </div>
          <p className="mt-5 max-w-md text-muted-foreground">
            Sistema informatizado de gestão do cuidado a pessoas com Transtorno do Espectro Autista da rede pública
            de Crateús-CE: fila multidisciplinar priorizada por IA, cadastro único sem duplicidade e histórico
            compartilhado entre NASF, NAPE, CREAES, Casa Mais Azul e CRASF.
          </p>
        </section>

        <section className="w-full max-w-md rounded-3xl bg-surface p-8">
          <h2 className="text-center text-2xl text-primary">Acessar conta</h2>
          <form onSubmit={entrar} className="mt-6 space-y-4">
            <div>
              <label className="field-label" htmlFor="email">
                E-mail institucional
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                placeholder="nome@crateus.ce.gov.br"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="senha">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="field-input"
                placeholder="••••••••"
              />
            </div>
            {erro && <p className="text-sm font-semibold text-destructive">{erro}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-secondary px-6 py-3 font-display font-bold text-secondary-foreground transition hover:opacity-90"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground">Contas de demonstração</p>
            <div className="mt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => preencher("enf")}
                className="rounded-full bg-primary/10 px-4 py-2 text-left text-sm font-semibold text-primary hover:bg-primary/20"
              >
                Riquelme Silva — Enfermeiro (NASF)
              </button>
              <button
                type="button"
                onClick={() => preencher("prof")}
                className="rounded-full bg-secondary/10 px-4 py-2 text-left text-sm font-semibold text-secondary hover:bg-secondary/20"
              >
                Pedro Henrique — Psicólogo (NAPE)
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Senha das duas contas: lovaas123</p>
          </div>
        </section>
      </main>

      <footer className="bg-primary py-3 text-center text-xs text-primary-foreground/90">
        ConectaEEEP © Todos os direitos reservados
      </footer>
    </div>
  );
}
