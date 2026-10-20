// Área do Cliente: rótulos, tipos e dados de demonstração.

/**
 * Enquanto o login não estiver ligado ao Supabase, a Área do Cliente roda com dados fictícios
 * e o botão "Entrar" leva direto ao painel. Desligar antes de publicar o site.
 */
export const portalDemo = false;

export const portalBase = '/area-do-cliente/';
export const portalRoutes = {
  login: portalBase,
  painel: `${portalBase}painel/`,
  chamados: `${portalBase}chamados/`,
  novoChamado: `${portalBase}chamados/novo/`,
  chamado: (id: number) => `${portalBase}chamados/detalhe/?id=${id}`,
  faturas: `${portalBase}faturas/`,
  fatura: (id: string) => `${portalBase}faturas/detalhe/?id=${encodeURIComponent(id)}`,
  boletos: `${portalBase}boletos/`,
  enviarRemessa: `${portalBase}boletos/enviar/`,
  remessa: (id: number) => `${portalBase}boletos/detalhe/?id=${id}`,
};

export type StatusId = 'aberto' | 'em_atendimento' | 'aguardando_peca' | 'resolvido' | 'cancelado';

export const statusInfo: Record<StatusId, { label: string; ativo: boolean }> = {
  aberto: { label: 'Aberto', ativo: true },
  em_atendimento: { label: 'Em atendimento', ativo: true },
  aguardando_peca: { label: 'Aguardando peça', ativo: true },
  resolvido: { label: 'Resolvido', ativo: false },
  cancelado: { label: 'Cancelado', ativo: false },
};

export type ProblemaId = 'atolamento' | 'qualidade' | 'suprimento' | 'erro' | 'nao-liga' | 'rede' | 'outro';

export const problemas: { id: ProblemaId; titulo: string; dica: string }[] = [
  { id: 'atolamento', titulo: 'Atolamento de papel', dica: 'Papel preso ou saindo amassado' },
  { id: 'qualidade', titulo: 'Falhas na impressão', dica: 'Manchas, riscos ou impressão clara' },
  { id: 'suprimento', titulo: 'Toner ou suprimento', dica: 'Toner no fim ou peça para trocar' },
  { id: 'erro', titulo: 'Mensagem de erro', dica: 'Código ou aviso no painel' },
  { id: 'nao-liga', titulo: 'Não liga', dica: 'Sem energia ou travado' },
  { id: 'rede', titulo: 'Rede ou digitalização', dica: 'Não imprime pela rede ou não digitaliza' },
  { id: 'outro', titulo: 'Outro problema', dica: 'Conte pra gente o que está acontecendo' },
];

export const problemaTitulo = (id: ProblemaId) => problemas.find((p) => p.id === id)?.titulo ?? 'Chamado';

export type FaturaStatus = 'aberta' | 'vencida' | 'paga';

export const faturaStatusInfo: Record<FaturaStatus, { label: string }> = {
  aberta: { label: 'Em aberto' },
  vencida: { label: 'Vencida' },
  paga: { label: 'Paga' },
};

/** Etapas de uma remessa de boletos e de cada boleto dentro dela, na ordem. */
export type RemessaStatus = 'enviado' | 'processando' | 'entregue';

export const remessaEtapas: { id: RemessaStatus; label: string }[] = [
  { id: 'enviado', label: 'Enviado' },
  { id: 'processando', label: 'Processando' },
  { id: 'entregue', label: 'Entregue' },
];

export const remessaRotulo = (status: RemessaStatus) => remessaEtapas.find((e) => e.id === status)!.label;

/** Arquivos aceitos no envio de boletos (os .EXT/.TXT são os arquivos de impressão gerados pelo sistema do cliente). */
export const remessaArquivos = {
  extensoes: ['ext', 'txt', 'rem', 'csv', 'pdf', 'zip'],
  /** Limite do armazenamento no plano gratuito do Supabase. */
  maxBytes: 50 * 1024 * 1024,
};

/** Prazo usado no indicador "resolvidos no prazo" do painel. */
export const prazoHoras = 48;

export interface Equipamento {
  id: string;
  modelo: string;
  tipo: string;
  local: string;
  serie: string;
}

// ---------- Demonstração (dados fictícios) ----------
// TODO(supabase): vêm das tabelas perfis, empresas e equipamentos da empresa logada.

export const demoCliente = {
  nome: 'Marina Souza',
  iniciais: 'MS',
  empresa: 'Construtora Horizonte',
  telefone: '(27) 3000-0000',
  /** Contrata o serviço de impressão e entrega de boletos. */
  servicoBoletos: true,
};

/** Empreendimentos cujos boletos a empresa envia para impressão. */
export const demoEmpreendimentos = ['Residencial Vista Mar', 'Edifício Jardim Camburi'];

export const demoEquipamentos: Equipamento[] = [
  { id: 'eq-1', modelo: 'Kyocera ECOSYS M3655idn', tipo: 'Multifuncional P&B', local: 'Financeiro · 2º andar', serie: 'R4P0Z12345' },
  { id: 'eq-2', modelo: 'Brother MFC-L8900CDW', tipo: 'Multifuncional colorida', local: 'Recepção · Térreo', serie: 'E78123K9N' },
  { id: 'eq-3', modelo: 'HP LaserJet Pro M428fdw', tipo: 'Multifuncional P&B', local: 'Recursos Humanos · 1º andar', serie: 'PHB3K45210' },
  { id: 'eq-4', modelo: 'Ricoh IM 430F', tipo: 'Multifuncional P&B', local: 'Diretoria · 3º andar', serie: '3100R720011' },
];

export const equipamentoPorId = (id: string | null) => demoEquipamentos.find((e) => e.id === id) ?? null;

/** Condições do contrato de demonstração, usadas para montar as faturas fictícias. Valores em centavos. */
export const demoContrato = {
  locacaoMensal: 148000,
  franquiaPaginas: 20000,
  /** Centavos por página excedente P&B (R$ 0,045). */
  excedentePb: 4.5,
  /** Centavos por página colorida (R$ 0,45). */
  paginaCor: 45,
};
