// Faturas da Área do Cliente.
// O portal só exibe: as faturas são geradas pelo financeiro e chegam prontas (somente leitura para o cliente).
// Na demonstração elas são montadas aqui a partir de demoContrato, sempre relativas à data de hoje.
// TODO(supabase): ler da tabela faturas; os PDFs vêm do armazenamento privado por link temporário.
import { demoContrato, demoEquipamentos, type FaturaStatus } from '../../data/portal';
import { dataDoDia, diaDe, diasAte, formatarCompetencia, formatarDia, formatarNumero } from './formato';

export interface ItemFatura {
  descricao: string;
  detalhe?: string;
  /** Centavos. */
  valor: number;
}

export interface Fatura {
  /** Número da fatura, ex.: "000482". */
  id: string;
  tipo: 'mensal' | 'avulsa';
  /** Mês de referência dos serviços, "AAAA-MM". */
  competencia: string;
  titulo?: string;
  emitidaEm: string;
  vencimento: string;
  pagaEm?: string;
  /** Centavos. */
  valor: number;
  notaFiscal: string;
  linhaDigitavel: string;
  /** Só nas mensais: páginas P&B excedentes e coloridas do mês. */
  paginas?: { excedentePb: number; cor: number };
  itens: ItemFatura[];
}

// ---------- Dados de exemplo ----------

// Consumo dos últimos 12 meses (do mais recente para o mais antigo).
const EXCEDENTE_PB = [6230, 5480, 7120, 4890, 6610, 5920, 8340, 6050, 5210, 7480, 6890, 4760];
const PAGINAS_COR = [612, 540, 705, 488, 650, 590, 812, 575, 530, 690, 640, 470];
const PAGO_ANTES = [0, 2, 1, 3, 1, 2, 0, 1, 2, 1, 3, 2];

const somarDias = (dia: string, dias: number) => {
  const d = dataDoDia(dia);
  d.setDate(d.getDate() + dias);
  return diaDe(d);
};

/** Soma meses mantendo o dia (31/01 + 1 mês → 28/02, não 03/03). */
const somarMeses = (dia: string, meses: number) => {
  const d = dataDoDia(dia);
  const alvo = new Date(d.getFullYear(), d.getMonth() + meses, 1);
  const ultimoDia = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
  alvo.setDate(Math.min(d.getDate(), ultimoDia));
  return diaDe(alvo);
};

/** Linha digitável fictícia com o formato de 47 dígitos (banco "999" não existe). */
function linhaDigitavel(numero: string, vencimento: string, valor: number) {
  const fator = String(Math.round((dataDoDia(vencimento).getTime() - new Date(2025, 1, 22).getTime()) / 864e5) + 1000);
  const n = numero.padStart(6, '0');
  return `99990.00${n.slice(0, 3)} ${n.slice(3)}00.000000 00000.000000 0 ${fator.padStart(4, '0')}${String(valor).padStart(10, '0')}`;
}

function mensal(indice: number, hoje: Date): Fatura {
  // A fatura mais recente vence daqui a 5 dias; as anteriores, um mês antes cada.
  const vencimento = somarMeses(somarDias(diaDe(hoje), 5), -indice);
  const competencia = somarMeses(vencimento, -1).slice(0, 7);
  const excedentePb = EXCEDENTE_PB[indice];
  const cor = PAGINAS_COR[indice];
  const itens: ItemFatura[] = [
    { descricao: 'Locação de equipamentos', detalhe: `${demoEquipamentos.length} multifuncionais`, valor: demoContrato.locacaoMensal },
    { descricao: 'Franquia de impressões P&B', detalhe: `${formatarNumero(demoContrato.franquiaPaginas)} páginas incluídas`, valor: 0 },
    { descricao: 'Excedente P&B', detalhe: `${formatarNumero(excedentePb)} páginas × R$ 0,045`, valor: Math.round(excedentePb * demoContrato.excedentePb) },
    { descricao: 'Impressões coloridas', detalhe: `${formatarNumero(cor)} páginas × R$ 0,45`, valor: cor * demoContrato.paginaCor },
  ];
  const valor = itens.reduce((total, item) => total + item.valor, 0);
  const id = String(482 - indice * 2).padStart(6, '0');
  return {
    id,
    tipo: 'mensal',
    competencia,
    emitidaEm: somarDias(vencimento, -10),
    vencimento,
    pagaEm: indice === 0 ? undefined : somarDias(vencimento, -PAGO_ANTES[indice]),
    valor,
    notaFiscal: String(318 - indice * 2),
    linhaDigitavel: linhaDigitavel(id, vencimento, valor),
    paginas: { excedentePb, cor },
    itens,
  };
}

function avulsa(hoje: Date): Fatura {
  const vencimento = somarDias(diaDe(hoje), -7);
  const valor = 38000;
  const id = '000481';
  return {
    id,
    tipo: 'avulsa',
    competencia: vencimento.slice(0, 7),
    titulo: 'Remanejamento de equipamentos',
    emitidaEm: somarDias(vencimento, -12),
    vencimento,
    valor,
    notaFiscal: '317',
    linhaDigitavel: linhaDigitavel(id, vencimento, valor),
    itens: [
      { descricao: 'Serviço de remanejamento', detalhe: 'Mudança da impressora da Recepção para o 1º andar', valor },
    ],
  };
}

function exemplos(hoje = new Date()): Fatura[] {
  return [avulsa(hoje), ...EXCEDENTE_PB.map((_, i) => mensal(i, hoje))];
}

// ---------- API usada pelas páginas ----------

export function statusDaFatura(fatura: Fatura, hoje = new Date()): FaturaStatus {
  if (fatura.pagaEm) return 'paga';
  return fatura.vencimento < diaDe(hoje) ? 'vencida' : 'aberta';
}

/** Mais recentes primeiro. */
export async function listarFaturas(): Promise<Fatura[]> {
  return exemplos().sort((a, b) => b.emitidaEm.localeCompare(a.emitidaEm));
}

export async function obterFatura(id: string): Promise<Fatura | null> {
  return exemplos().find((f) => f.id === id) ?? null;
}

/** Fatura que pede atenção: a vencida mais antiga ou, sem vencidas, a próxima a vencer. */
export function faturaEmDestaque(lista: Fatura[], hoje = new Date()) {
  const pendentes = lista
    .filter((f) => statusDaFatura(f, hoje) !== 'paga')
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  return pendentes[0] ?? null;
}

export function resumirFaturas(lista: Fatura[], hoje = new Date()) {
  const ano = String(hoje.getFullYear());
  const mensais = lista.filter((f) => f.tipo === 'mensal').sort((a, b) => a.competencia.localeCompare(b.competencia));
  const ultimos12 = mensais.slice(-12);
  const pendentes = lista.filter((f) => statusDaFatura(f, hoje) !== 'paga');
  const paginas = ultimos12.reduce(
    (total, f) => total + demoContrato.franquiaPaginas + (f.paginas?.excedentePb ?? 0) + (f.paginas?.cor ?? 0),
    0,
  );

  return {
    vencidas: lista.filter((f) => statusDaFatura(f, hoje) === 'vencida'),
    emAberto: pendentes.reduce((total, f) => total + f.valor, 0),
    pagoNoAno: lista.filter((f) => f.pagaEm?.startsWith(ano)).reduce((total, f) => total + f.valor, 0),
    mediaMensal: ultimos12.length ? Math.round(ultimos12.reduce((t, f) => t + f.valor, 0) / ultimos12.length) : 0,
    paginas12Meses: paginas,
    ultimos12: ultimos12.map((f) => ({ id: f.id, competencia: f.competencia, valor: f.valor })),
  };
}

/** "Setembro de 2026" nas mensais; o título do serviço nas avulsas. */
export const tituloFatura = (fatura: Fatura) => fatura.titulo ?? formatarCompetencia(fatura.competencia);

/** "Vence em 5 dias", "Vence hoje", "Vencida há 7 dias" ou "Paga em 08/09/2026". */
export function prazoFatura(fatura: Fatura, hoje = new Date()) {
  if (fatura.pagaEm) return `Paga em ${formatarDia(fatura.pagaEm)}`;
  const dias = diasAte(fatura.vencimento, hoje);
  if (dias === 0) return 'Vence hoje';
  if (dias > 0) return `Vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
  return `Vencida há ${-dias} ${dias === -1 ? 'dia' : 'dias'}`;
}

/** Só os números da linha digitável, para colar no app do banco. */
export const codigoParaCopiar = (fatura: Fatura) => fatura.linhaDigitavel.replace(/\D/g, '');
