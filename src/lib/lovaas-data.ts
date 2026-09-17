export type Role = "enfermeiro" | "profissional";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: Role;
  cargo: string;
  unidade: string;
  especialidade?: Especialidade;
};

export type Especialidade =
  | "Psicologia"
  | "Psicopedagogia"
  | "Terapia Ocupacional"
  | "Fonoaudiologia"
  | "Educação Física Adaptada";

export const ESPECIALIDADES: Especialidade[] = [
  "Psicologia",
  "Psicopedagogia",
  "Terapia Ocupacional",
  "Fonoaudiologia",
  "Educação Física Adaptada",
];

export type Servico = "NASF" | "NAPE" | "CREAES" | "Casa Mais Azul" | "CRASF";
export const SERVICOS: Servico[] = ["NASF", "NAPE", "CREAES", "Casa Mais Azul", "CRASF"];

export type Prioridade = "Urgente" | "Curto prazo" | "Lista de espera";
export type StatusConsulta = "pendente" | "concluida" | "ausente";

export type Paciente = {
  id: string;
  prontuario: string;
  hd: string;
  dataAbertura: string;
  nome: string;
  cpf: string;
  cns: string;
  nascimento: string;
  nomeMae: string;
  telefone: string;
  sexo: string;
  cor: string;
  endereco: string;
  numero: string;
  bairro: string;
  aps: string;
  municipio: string;
  estado: string;
  responsavelNome: string;
  responsavelCns: string;
  responsavelNascimento: string;
  nivelTEA: "Nível 1" | "Nível 2" | "Nível 3";
  condicoes: string[];
  servico: Servico;
};

export type Registro = {
  profissional: string;
  data: string;
  anamnese: Record<string, string>;
  avaliacaoEstruturada: string;
  avaliacaoObs: string;
  conduta: string;
  encaminhamento: string;
  observacoes: string;
  anexos: string[];
};

export type Consulta = {
  id: string;
  pacienteId: string;
  especialidade: Especialidade;
  profissionalId: string;
  profissionalNome: string;
  servico: Servico;
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  prioridade: Prioridade;
  status: StatusConsulta;
  motivo: string;
  criadoPor: string;
  registro?: Registro;
};

export const USUARIOS: Usuario[] = [
  {
    id: "u1",
    nome: "Riquelme Silva",
    email: "riquelme@crateus.ce.gov.br",
    senha: "lovaas123",
    role: "enfermeiro",
    cargo: "Enfermeiro",
    unidade: "APS Centro — NASF",
  },
  {
    id: "u2",
    nome: "Pedro Henrique",
    email: "pedro@crateus.ce.gov.br",
    senha: "lovaas123",
    role: "profissional",
    cargo: "Psicólogo",
    unidade: "NAPE — Crateús",
    especialidade: "Psicologia",
  },
];

function isoOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const PACIENTES_SEED: Paciente[] = [
  {
    id: "p1",
    prontuario: "00012845",
    hd: "Transtorno do Espectro Autista (F84.0)",
    dataAbertura: "2024-03-12",
    nome: "DANILO TAVARES SILVA JUNIOR",
    cpf: "123.456.789-10",
    cns: "708 4012 5566 0012",
    nascimento: "2016-04-22",
    nomeMae: "Maria Tavares Silva",
    telefone: "(88)99812-4410",
    sexo: "Masculino",
    cor: "Parda",
    endereco: "Rua José de Alencar",
    numero: "310",
    bairro: "Centro",
    aps: "APS Centro",
    municipio: "Crateús",
    estado: "Ceará",
    responsavelNome: "Maria Tavares Silva",
    responsavelCns: "708 4012 5566 1188",
    responsavelNascimento: "1990-01-18",
    nivelTEA: "Nível 2",
    condicoes: ["Atraso de linguagem", "Seletividade alimentar"],
    servico: "NASF",
  },
  {
    id: "p2",
    prontuario: "00012901",
    hd: "TEA com hiperatividade associada",
    dataAbertura: "2024-06-04",
    nome: "EVERSON JOSE LISBOA RIBEIRO",
    cpf: "234.567.891-20",
    cns: "708 4012 5566 0025",
    nascimento: "2015-11-03",
    nomeMae: "Joana Lisboa Ribeiro",
    telefone: "(88)99745-2210",
    sexo: "Masculino",
    cor: "Branca",
    endereco: "Rua Firmino Rocha",
    numero: "88",
    bairro: "Planalto",
    aps: "APS Planalto",
    municipio: "Crateús",
    estado: "Ceará",
    responsavelNome: "Joana Lisboa Ribeiro",
    responsavelCns: "708 4012 5566 2231",
    responsavelNascimento: "1988-07-09",
    nivelTEA: "Nível 1",
    condicoes: ["TDAH"],
    servico: "NAPE",
  },
  {
    id: "p3",
    prontuario: "00013044",
    hd: "Transtorno do Espectro Autista (F84.0)",
    dataAbertura: "2025-01-20",
    nome: "JOÃO PEDRO SOUSA BERNARDINO",
    cpf: "345.678.912-30",
    cns: "708 4012 5566 0031",
    nascimento: "2018-02-14",
    nomeMae: "Antônia Sousa Bernardino",
    telefone: "(88)99611-7788",
    sexo: "Masculino",
    cor: "Parda",
    endereco: "Av. Dom Pedro II",
    numero: "1240",
    bairro: "Fátima",
    aps: "APS Fátima",
    municipio: "Crateús",
    estado: "Ceará",
    responsavelNome: "Antônia Sousa Bernardino",
    responsavelCns: "708 4012 5566 3310",
    responsavelNascimento: "1992-05-30",
    nivelTEA: "Nível 3",
    condicoes: ["Ausência de fala funcional", "Hipersensibilidade auditiva"],
    servico: "Casa Mais Azul",
  },
  {
    id: "p4",
    prontuario: "00013120",
    hd: "TEA em investigação diagnóstica",
    dataAbertura: "2025-04-02",
    nome: "HEITOR DA SILVA SOUSA",
    cpf: "456.789.123-40",
    cns: "708 4012 5566 0048",
    nascimento: "2019-09-27",
    nomeMae: "Cleide da Silva Sousa",
    telefone: "(88)99522-6633",
    sexo: "Masculino",
    cor: "Preta",
    endereco: "Rua Coronel Zezé",
    numero: "45",
    bairro: "Altamira",
    aps: "APS Altamira",
    municipio: "Crateús",
    estado: "Ceará",
    responsavelNome: "Cleide da Silva Sousa",
    responsavelCns: "708 4012 5566 4407",
    responsavelNascimento: "1994-12-11",
    nivelTEA: "Nível 2",
    condicoes: ["Dificuldade de interação social"],
    servico: "CREAES",
  },
  {
    id: "p5",
    prontuario: "00013188",
    hd: "Transtorno do Espectro Autista (F84.0)",
    dataAbertura: "2025-07-15",
    nome: "SAMUEL PAIVA DOS SANTOS",
    cpf: "567.891.234-50",
    cns: "708 4012 5566 0055",
    nascimento: "2017-09-13",
    nomeMae: "Rita Paiva dos Santos",
    telefone: "(88)99433-1100",
    sexo: "Masculino",
    cor: "Parda",
    endereco: "Rua Santos Dumont",
    numero: "622",
    bairro: "Centro",
    aps: "APS Centro",
    municipio: "Crateús",
    estado: "Ceará",
    responsavelNome: "Rita Paiva dos Santos",
    responsavelCns: "708 4012 5566 5514",
    responsavelNascimento: "1991-03-25",
    nivelTEA: "Nível 3",
    condicoes: ["Epilepsia controlada", "Dificuldade de coordenação motora"],
    servico: "CRASF",
  },
];

export const CONSULTAS_SEED: Consulta[] = [
  {
    id: "c1",
    pacienteId: "p1",
    especialidade: "Psicologia",
    profissionalId: "u2",
    profissionalNome: "Pedro Henrique",
    servico: "NAPE",
    data: isoOffset(0),
    hora: "08:00",
    prioridade: "Urgente",
    status: "pendente",
    motivo: "Avaliação inicial — crises de desregulação na escola.",
    criadoPor: "Riquelme Silva",
  },
  {
    id: "c2",
    pacienteId: "p3",
    especialidade: "Psicologia",
    profissionalId: "u2",
    profissionalNome: "Pedro Henrique",
    servico: "NAPE",
    data: isoOffset(0),
    hora: "09:00",
    prioridade: "Urgente",
    status: "pendente",
    motivo: "Acompanhamento de comunicação alternativa.",
    criadoPor: "Riquelme Silva",
  },
  {
    id: "c3",
    pacienteId: "p4",
    especialidade: "Psicologia",
    profissionalId: "u2",
    profissionalNome: "Pedro Henrique",
    servico: "NAPE",
    data: isoOffset(1),
    hora: "10:00",
    prioridade: "Curto prazo",
    status: "pendente",
    motivo: "Triagem para fechamento diagnóstico.",
    criadoPor: "Riquelme Silva",
  },
  {
    id: "c4",
    pacienteId: "p5",
    especialidade: "Psicologia",
    profissionalId: "u2",
    profissionalNome: "Pedro Henrique",
    servico: "NAPE",
    data: isoOffset(2),
    hora: "08:00",
    prioridade: "Urgente",
    status: "pendente",
    motivo: "Suporte à família — manejo comportamental.",
    criadoPor: "Riquelme Silva",
  },
  {
    id: "c5",
    pacienteId: "p1",
    especialidade: "Fonoaudiologia",
    profissionalId: "u9",
    profissionalNome: "Ana Beatriz Lopes",
    servico: "NASF",
    data: isoOffset(-7),
    hora: "16:00",
    prioridade: "Curto prazo",
    status: "concluida",
    motivo: "Estimulação de linguagem expressiva.",
    criadoPor: "Riquelme Silva",
    registro: {
      profissional: "Ana Beatriz Lopes",
      data: isoOffset(-7),
      anamnese: { "Comunicação": "Usa palavras isoladas e gestos." },
      avaliacaoEstruturada: "Evolução parcial",
      avaliacaoObs: "Ampliou vocabulário funcional para 20 palavras.",
      conduta: "Manter estimulação semanal e orientação familiar.",
      encaminhamento: "Nenhum",
      observacoes: "Boa adesão da mãe às orientações.",
      anexos: [],
    },
  },
  {
    id: "c6",
    pacienteId: "p1",
    especialidade: "Terapia Ocupacional",
    profissionalId: "u8",
    profissionalNome: "Carlos Eduardo Nunes",
    servico: "CREAES",
    data: isoOffset(-14),
    hora: "16:00",
    prioridade: "Lista de espera",
    status: "ausente",
    motivo: "Integração sensorial.",
    criadoPor: "Riquelme Silva",
  },
  {
    id: "c7",
    pacienteId: "p3",
    especialidade: "Psicologia",
    profissionalId: "u2",
    profissionalNome: "Pedro Henrique",
    servico: "NAPE",
    data: isoOffset(-5),
    hora: "14:00",
    prioridade: "Urgente",
    status: "concluida",
    motivo: "Sessão de acompanhamento.",
    criadoPor: "Riquelme Silva",
    registro: {
      profissional: "Pedro Henrique",
      data: isoOffset(-5),
      anamnese: { "Sociabilidade": "Prefere brincar sozinho; tolera pares por curtos períodos." },
      avaliacaoEstruturada: "Evolução parcial",
      avaliacaoObs: "Reduziu episódios de autolesão em ambiente escolar.",
      conduta: "Seguir plano de manejo com a escola; sessões quinzenais.",
      encaminhamento: "Terapia Ocupacional",
      observacoes: "Família orientada sobre rotina visual.",
      anexos: [],
    },
  },
  {
    id: "c8",
    pacienteId: "p3",
    especialidade: "Fonoaudiologia",
    profissionalId: "u9",
    profissionalNome: "Ana Beatriz Lopes",
    servico: "NASF",
    data: isoOffset(4),
    hora: "09:00",
    prioridade: "Urgente",
    status: "pendente",
    motivo: "Comunicação alternativa.",
    criadoPor: "Riquelme Silva",
  },
  {
    id: "c9",
    pacienteId: "p4",
    especialidade: "Psicopedagogia",
    profissionalId: "u7",
    profissionalNome: "Lívia Moreira",
    servico: "NAPE",
    data: isoOffset(5),
    hora: "10:00",
    prioridade: "Curto prazo",
    status: "pendente",
    motivo: "Dificuldade de alfabetização.",
    criadoPor: "Riquelme Silva",
  },
  {
    id: "c10",
    pacienteId: "p5",
    especialidade: "Educação Física Adaptada",
    profissionalId: "u6",
    profissionalNome: "Marcos Vinícius Dias",
    servico: "NAPE",
    data: isoOffset(6),
    hora: "11:00",
    prioridade: "Lista de espera",
    status: "pendente",
    motivo: "Coordenação motora grossa.",
    criadoPor: "Riquelme Silva",
  },
  {
    id: "c11",
    pacienteId: "p5",
    especialidade: "Terapia Ocupacional",
    profissionalId: "u8",
    profissionalNome: "Carlos Eduardo Nunes",
    servico: "CREAES",
    data: isoOffset(3),
    hora: "15:00",
    prioridade: "Curto prazo",
    status: "pendente",
    motivo: "Atividades de vida diária.",
    criadoPor: "Riquelme Silva",
  },
];

export const ANAMNESES: Record<Especialidade, { titulo: string; campos: string[] }> = {
  Psicologia: {
    titulo: "Anamnese Psicológica (NAPE)",
    campos: [
      "1. Identificação complementar (escola, série, turno, zona)",
      "2. Dados familiares (responsável, irmãos, situação conjugal)",
      "3. Queixa / motivação da busca pelo serviço",
      "4. Histórico da escolaridade e apoio pedagógico",
      "5. Aspectos motores",
      "6. Aspectos perceptivos",
      "7. Aspectos emocionais",
      "8. Sociabilidade",
      "9. Atitudes sociais predominantes",
      "10. Sono",
      "11. Saúde (diagnóstico prévio, medicação)",
      "12. Rotina e observações",
    ],
  },
  Psicopedagogia: {
    titulo: "Anamnese Psicopedagógica (NAPE)",
    campos: [
      "1. Identificação complementar (escola, série, turma, zona)",
      "2. Dados familiares (escolaridade e ocupação dos pais)",
      "3. Concepção da criança/adolescente (gestação e parto)",
      "4. História e queixa atual",
      "5. Histórico escolar e disciplinas com dificuldade",
      "6. Desenvolvimento da linguagem",
      "7. Aspectos cognitivos, comportamentais e motores",
      "8. Sociabilidade",
      "9. Observações",
    ],
  },
  "Educação Física Adaptada": {
    titulo: "Instrumental da Educadora Física (NAPE)",
    campos: [
      "1. Identificação e atendimentos concomitantes",
      "2. Habilidades motoras grossas",
      "3. Coordenação motora fina",
      "4. Desenvolvimento cognitivo e atenção",
      "5. Aspectos sociais e emocionais",
      "6. Condicionamento físico",
      "7. Objetivos, estratégias e recursos de acessibilidade",
    ],
  },
  Fonoaudiologia: {
    titulo: "Síntese de Acompanhamento — Fonoaudiologia",
    campos: [
      "1. Objetivo da sessão",
      "2. Comunicação e linguagem (compreensiva e expressiva)",
      "3. Aspectos orofaciais e alimentação",
      "4. Respostas às estratégias aplicadas",
      "5. Orientações à família",
    ],
  },
  "Terapia Ocupacional": {
    titulo: "Síntese de Acompanhamento — Terapia Ocupacional",
    campos: [
      "1. Objetivo da sessão",
      "2. Perfil sensorial",
      "3. Atividades de vida diária",
      "4. Participação e engajamento na sessão",
      "5. Orientações à família e à escola",
    ],
  },
};
