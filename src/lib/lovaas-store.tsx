import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CONSULTAS_SEED,
  PACIENTES_SEED,
  USUARIOS,
  type Consulta,
  type Especialidade,
  type Paciente,
  type Prioridade,
  type Registro,
  type Usuario,
} from "./lovaas-data";

const STORAGE_KEY = "lovaas-state-v1";
const SESSION_KEY = "lovaas-session-v1";

type State = { pacientes: Paciente[]; consultas: Consulta[] };

type Ctx = {
  hidratado: boolean;
  usuario: Usuario | null;
  login: (email: string, senha: string) => { ok: boolean; erro?: string };
  logout: () => void;
  pacientes: Paciente[];
  consultas: Consulta[];
  getPaciente: (id: string) => Paciente | undefined;
  consultasDoPaciente: (id: string) => Consulta[];
  filaDoPaciente: (id: string) => number;
  cadastrarPaciente: (p: Omit<Paciente, "id">) => { ok: boolean; erro?: string; id?: string };
  atualizarPaciente: (id: string, dados: Partial<Paciente>) => void;
  criarEncaminhamento: (args: {
    pacienteId: string;
    especialidade: Especialidade;
    prioridade: Prioridade;
    motivo: string;
  }) => { ok: boolean; erro?: string; consulta?: Consulta };
  registrarAtendimento: (consultaId: string, registro: Registro) => void;
  marcarAusencia: (consultaId: string) => void;
};

const LovaasContext = createContext<Ctx | null>(null);

function carregar(): State {
  if (typeof window === "undefined") return { pacientes: PACIENTES_SEED, consultas: CONSULTAS_SEED };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {
    /* ignora */
  }
  return { pacientes: PACIENTES_SEED, consultas: CONSULTAS_SEED };
}

function somenteDigitos(v: string) {
  return v.replace(/\D/g, "");
}

/** Algoritmo de priorização: define data e horário da consulta encaminhada. */
export function agendarPorPrioridade(
  consultas: Consulta[],
  prioridade: Prioridade,
  nivelTEA: string,
): { data: string; hora: string } {
  const prazoBase = prioridade === "Urgente" ? 1 : prioridade === "Curto prazo" ? 7 : 21;
  const ajusteNivel = nivelTEA === "Nível 3" ? -1 : nivelTEA === "Nível 2" ? 0 : 1;
  let dias = Math.max(1, prazoBase + ajusteNivel);
  const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  for (let tentativa = 0; tentativa < 60; tentativa++) {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    const diaSemana = d.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      dias++;
      continue;
    }
    const data = d.toISOString().slice(0, 10);
    const ocupados = consultas.filter((c) => c.data === data && c.status === "pendente").map((c) => c.hora);
    const livre = horarios.find((h) => !ocupados.includes(h));
    if (livre) return { data, hora: livre };
    dias++;
  }
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return { data: d.toISOString().slice(0, 10), hora: "08:00" };
}

export function LovaasProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ pacientes: PACIENTES_SEED, consultas: CONSULTAS_SEED });
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    setState(carregar());
    try {
      const s = window.localStorage.getItem(SESSION_KEY);
      if (s) setUsuario(USUARIOS.find((u) => u.id === s) ?? null);
    } catch {
      /* ignora */
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hidratado]);

  const login = useCallback((email: string, senha: string) => {
    const u = USUARIOS.find(
      (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.senha === senha,
    );
    if (!u) return { ok: false, erro: "E-mail ou senha inválidos." };
    setUsuario(u);
    window.localStorage.setItem(SESSION_KEY, u.id);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    window.localStorage.removeItem(SESSION_KEY);
  }, []);

  const value = useMemo<Ctx>(() => {
    const getPaciente = (id: string) => state.pacientes.find((p) => p.id === id);
    const consultasDoPaciente = (id: string) =>
      state.consultas
        .filter((c) => c.pacienteId === id)
        .sort((a, b) => (a.data + a.hora < b.data + b.hora ? 1 : -1));

    return {
      hidratado,
      usuario,
      login,
      logout,
      pacientes: state.pacientes,
      consultas: state.consultas,
      getPaciente,
      consultasDoPaciente,
      filaDoPaciente: (id) =>
        state.consultas.filter((c) => c.pacienteId === id && c.status === "pendente").length,
      cadastrarPaciente: (p) => {
        const cpf = somenteDigitos(p.cpf);
        const dup = state.pacientes.find((x) => somenteDigitos(x.cpf) === cpf);
        if (dup) {
          return {
            ok: false,
            erro: `Já existe cadastro para este CPF: ${dup.nome} (prontuário ${dup.prontuario}, serviço ${dup.servico}).`,
          };
        }
        const id = `p${Date.now()}`;
        setState((s) => ({ ...s, pacientes: [...s.pacientes, { ...p, id }] }));
        return { ok: true, id };
      },
      atualizarPaciente: (id, dados) =>
        setState((s) => ({
          ...s,
          pacientes: s.pacientes.map((p) => (p.id === id ? { ...p, ...dados } : p)),
        })),
      criarEncaminhamento: ({ pacienteId, especialidade, prioridade, motivo }) => {
        const paciente = getPaciente(pacienteId);
        if (!paciente) return { ok: false, erro: "Paciente não encontrado." };
        const jaExiste = state.consultas.find(
          (c) => c.pacienteId === pacienteId && c.especialidade === especialidade && c.status === "pendente",
        );
        if (jaExiste) {
          return {
            ok: false,
            erro: `Duplicidade evitada: já existe encaminhamento pendente de ${especialidade} para ${new Date(
              jaExiste.data + "T12:00:00",
            ).toLocaleDateString("pt-BR")} às ${jaExiste.hora}.`,
          };
        }
        const { data, hora } = agendarPorPrioridade(state.consultas, prioridade, paciente.nivelTEA);
        const consulta: Consulta = {
          id: `c${Date.now()}`,
          pacienteId,
          especialidade,
          profissionalId: especialidade === "Psicologia" ? "u2" : "u0",
          profissionalNome: especialidade === "Psicologia" ? "Pedro Henrique" : "Equipe " + especialidade,
          servico: paciente.servico,
          data,
          hora,
          prioridade,
          status: "pendente",
          motivo,
          criadoPor: usuario?.nome ?? "Sistema",
        };
        setState((s) => ({ ...s, consultas: [...s.consultas, consulta] }));
        return { ok: true, consulta };
      },
      registrarAtendimento: (consultaId, registro) =>
        setState((s) => ({
          ...s,
          consultas: s.consultas.map((c) =>
            c.id === consultaId ? { ...c, status: "concluida", registro } : c,
          ),
        })),
      marcarAusencia: (consultaId) =>
        setState((s) => ({
          ...s,
          consultas: s.consultas.map((c) => (c.id === consultaId ? { ...c, status: "ausente" } : c)),
        })),
    };
  }, [state, usuario, hidratado, login, logout]);

  return <LovaasContext.Provider value={value}>{children}</LovaasContext.Provider>;
}

export function useLovaas() {
  const ctx = useContext(LovaasContext);
  if (!ctx) throw new Error("useLovaas precisa estar dentro de LovaasProvider");
  return ctx;
}

/** Resumo por IA: análise das informações da ficha e do histórico de consultas. */
export function gerarResumoIA(paciente: Paciente, consultas: Consulta[]) {
  const idade = Math.floor(
    (Date.now() - new Date(paciente.nascimento + "T12:00:00").getTime()) / (365.25 * 24 * 3600 * 1000),
  );
  const concluidas = consultas.filter((c) => c.status === "concluida");
  const pendentes = consultas.filter((c) => c.status === "pendente");
  const ausencias = consultas.filter((c) => c.status === "ausente");
  const areas = Array.from(new Set(concluidas.map((c) => c.especialidade)));
  const ultima = concluidas[0];

  const partes: string[] = [];
  partes.push(
    `${paciente.nome.split(" ")[0]}, ${idade} anos, com ${paciente.hd} — TEA ${paciente.nivelTEA}, acompanhado(a) pelo serviço ${paciente.servico} (${paciente.aps}).`,
  );
  if (paciente.condicoes.length)
    partes.push(`Condições associadas registradas: ${paciente.condicoes.join(", ")}.`);
  partes.push(
    `Histórico: ${concluidas.length} atendimento(s) concluído(s)${
      areas.length ? ` em ${areas.join(", ")}` : ""
    }, ${pendentes.length} na fila e ${ausencias.length} ausência(s).`,
  );
  if (ultima?.registro)
    partes.push(
      `Último registro (${ultima.especialidade}, ${new Date(ultima.data + "T12:00:00").toLocaleDateString("pt-BR")}): ${ultima.registro.avaliacaoObs || ultima.registro.conduta}`,
    );
  if (ausencias.length >= 1)
    partes.push("Atenção: há faltas registradas — reforçar contato com o responsável antes da próxima sessão.");
  if (pendentes.length >= 3)
    partes.push("Fila multidisciplinar extensa: priorizar articulação entre os serviços da rede para evitar sobreposição.");
  if (paciente.nivelTEA === "Nível 3")
    partes.push("Nível 3 de suporte: recomenda-se ambiente com baixa estimulação sensorial e apoio contínuo do responsável.");

  return partes.join(" ");
}
