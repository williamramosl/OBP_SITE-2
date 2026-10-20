// Chamados da Área do Cliente.
// Na demonstração os dados ficam só neste navegador. As funções já são assíncronas para que, ao ligar
// o Supabase, mude apenas o corpo delas e as páginas continuem iguais.
// TODO(supabase): trocar o armazenamento local pelas tabelas chamados e chamado_eventos.
import { demoCliente, prazoHoras, statusInfo, type ProblemaId, type StatusId } from '../../data/portal';

export interface Evento {
  em: string;
  autor: 'cliente' | 'equipe';
  nome: string;
  mensagem: string;
  /** Presente quando o evento muda o status do chamado. */
  status?: StatusId;
}

export interface Chamado {
  id: number;
  equipamentoId: string | null;
  problema: ProblemaId;
  descricao: string;
  urgente: boolean;
  contatoNome: string;
  contatoTelefone: string;
  anexos: string[];
  status: StatusId;
  criadoEm: string;
  atualizadoEm: string;
  resolvidoEm?: string;
  eventos: Evento[];
}

export type NovoChamado = Pick<
  Chamado,
  'equipamentoId' | 'problema' | 'descricao' | 'urgente' | 'contatoNome' | 'contatoTelefone' | 'anexos'
>;

const CHAVE = 'obp-portal-demo:chamados:v1';
const HORA = 36e5;
const TECNICO = 'Carlos Lima';

// ---------- Dados de exemplo ----------

type Passo = [horasDepois: number, status: StatusId | null, mensagem: string, autor?: Evento['autor']];

function exemplo(
  id: number,
  equipamentoId: string,
  problema: ProblemaId,
  descricao: string,
  horasAtras: number,
  passos: Passo[],
  urgente = false,
): Chamado {
  const criado = Date.now() - horasAtras * HORA;
  const eventos: Evento[] = [
    { em: new Date(criado).toISOString(), autor: 'cliente', nome: demoCliente.nome, mensagem: 'Chamado aberto pela Área do Cliente.', status: 'aberto' },
    ...passos.map(([horas, status, mensagem, autor = 'equipe']) => ({
      em: new Date(criado + horas * HORA).toISOString(),
      autor,
      nome: autor === 'equipe' ? TECNICO : demoCliente.nome,
      mensagem,
      ...(status ? { status } : {}),
    })),
  ];
  const status = eventos.findLast((e) => e.status)?.status ?? 'aberto';
  const atualizadoEm = eventos[eventos.length - 1].em;
  return {
    id,
    equipamentoId,
    problema,
    descricao,
    urgente,
    contatoNome: demoCliente.nome,
    contatoTelefone: demoCliente.telefone,
    anexos: [],
    status,
    criadoEm: eventos[0].em,
    atualizadoEm,
    resolvidoEm: status === 'resolvido' ? atualizadoEm : undefined,
    eventos,
  };
}

const descricoes: Record<ProblemaId, string> = {
  atolamento: 'O papel está prendendo na bandeja 2 e saindo amassado.',
  qualidade: 'As impressões estão saindo com uma faixa clara no meio da folha.',
  suprimento: 'O painel avisa que o toner está acabando.',
  erro: 'Aparece um código de erro no painel e a impressora não imprime.',
  'nao-liga': 'A impressora não liga desde hoje cedo, mesmo ligada na tomada.',
  rede: 'Ninguém do setor consegue imprimir pela rede desde ontem.',
  outro: 'A gaveta de papel não está fechando direito.',
};

const solucoes: Record<ProblemaId, string> = {
  atolamento: 'Rolos de alimentação limpos e ajustados. Equipamento testado e funcionando normalmente.',
  qualidade: 'Cilindro substituído e calibração refeita. Impressão testada e aprovada.',
  suprimento: 'Toner substituído e níveis conferidos.',
  erro: 'Erro corrigido e firmware atualizado. Equipamento funcionando normalmente.',
  'nao-liga': 'Fonte de alimentação substituída. Equipamento ligado e testado.',
  rede: 'Configuração de rede refeita. Impressão e digitalização testadas no local.',
  outro: 'Atendimento concluído.',
};

const recebido = 'Recebemos o seu chamado. O técnico Carlos Lima ficou responsável pelo atendimento.';

function exemplos(): Chamado[] {
  const resolvidos: [number, string, ProblemaId, number, number][] = [
    [1056, 'eq-3', 'atolamento', 8, 5],
    [1055, 'eq-1', 'qualidade', 15, 26],
    [1054, 'eq-2', 'suprimento', 27, 30],
    [1053, 'eq-4', 'rede', 41, 50],
    [1052, 'eq-1', 'atolamento', 48, 4],
    [1050, 'eq-3', 'erro', 63, 20],
    [1049, 'eq-2', 'nao-liga', 77, 70],
    [1048, 'eq-4', 'qualidade', 95, 18],
    [1047, 'eq-1', 'suprimento', 110, 22],
    [1046, 'eq-3', 'rede', 128, 9],
    [1045, 'eq-2', 'atolamento', 150, 40],
    [1044, 'eq-1', 'erro', 162, 28],
  ];

  return [
    exemplo(1059, 'eq-4', 'erro', 'Aparece o código C6000 no painel e a impressora parou de imprimir.', 2, [], true),
    exemplo(1058, 'eq-2', 'qualidade', 'As impressões coloridas estão saindo com uma faixa clara no meio da folha.', 26, [
      [0.4, 'em_atendimento', recebido],
      [3, null, 'Técnico a caminho. Previsão de chegada às 14h.'],
    ]),
    exemplo(1057, 'eq-1', 'suprimento', 'O painel avisa que a unidade de imagem está no fim da vida útil.', 74, [
      [0.6, 'em_atendimento', recebido],
      [5, 'aguardando_peca', 'Unidade de imagem solicitada ao fabricante. Previsão de entrega em 2 dias úteis.'],
    ]),
    exemplo(1051, 'eq-3', 'outro', descricoes.outro, 55 * 24, [
      [1.5, 'cancelado', 'A gaveta estava desencaixada e já resolvemos por aqui. Obrigada!', 'cliente'],
    ]),
    ...resolvidos.map(([id, eq, problema, dias, horas]) =>
      exemplo(id, eq, problema, descricoes[problema], dias * 24, [
        [0.5, 'em_atendimento', recebido],
        [horas, 'resolvido', solucoes[problema]],
      ]),
    ),
  ];
}

// ---------- Armazenamento ----------

let memoria: Chamado[] | null = null;

function ler(): Chamado[] {
  if (memoria) return memoria;
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) return (memoria = JSON.parse(salvo) as Chamado[]);
  } catch {
    // Sem acesso ao armazenamento (aba anônima, bloqueio de cookies): segue só em memória.
  }
  memoria = exemplos();
  gravar();
  return memoria;
}

function gravar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(memoria));
  } catch {
    // Idem: sem armazenamento os dados duram até a página ser recarregada.
  }
}

const copia = <T>(valor: T): T => structuredClone(valor);

function adicionarEvento(chamado: Chamado, evento: Omit<Evento, 'em'>) {
  const em = new Date().toISOString();
  chamado.eventos.push({ em, ...evento });
  chamado.atualizadoEm = em;
  if (evento.status) chamado.status = evento.status;
}

// ---------- API usada pelas páginas ----------

export async function listarChamados(): Promise<Chamado[]> {
  return copia(ler()).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}

export async function obterChamado(id: number): Promise<Chamado | null> {
  return copia(ler().find((c) => c.id === id) ?? null);
}

export async function abrirChamado(dados: NovoChamado): Promise<Chamado> {
  const lista = ler();
  const agora = new Date().toISOString();
  const chamado: Chamado = {
    ...dados,
    id: Math.max(1000, ...lista.map((c) => c.id)) + 1,
    status: 'aberto',
    criadoEm: agora,
    atualizadoEm: agora,
    eventos: [{ em: agora, autor: 'cliente', nome: demoCliente.nome, mensagem: 'Chamado aberto pela Área do Cliente.', status: 'aberto' }],
  };
  lista.push(chamado);
  gravar();
  return copia(chamado);
}

export async function enviarMensagem(id: number, mensagem: string): Promise<Chamado> {
  const chamado = ler().find((c) => c.id === id);
  if (!chamado) throw new Error('Chamado não encontrado.');
  if (!statusInfo[chamado.status].ativo) throw new Error('Este chamado já foi encerrado.');
  adicionarEvento(chamado, { autor: 'cliente', nome: demoCliente.nome, mensagem });
  gravar();
  return copia(chamado);
}

/** O cliente só cancela enquanto o chamado ainda não entrou em atendimento. */
export async function cancelarChamado(id: number): Promise<Chamado> {
  const chamado = ler().find((c) => c.id === id);
  if (!chamado) throw new Error('Chamado não encontrado.');
  if (chamado.status !== 'aberto') throw new Error('Este chamado já está em atendimento e não pode ser cancelado.');
  adicionarEvento(chamado, { autor: 'cliente', nome: demoCliente.nome, mensagem: 'Chamado cancelado pelo cliente.', status: 'cancelado' });
  gravar();
  return copia(chamado);
}

// ---------- Indicadores do painel ----------

export function resumir(lista: Chamado[], agora = new Date()) {
  const contar = (...status: StatusId[]) => lista.filter((c) => status.includes(c.status)).length;
  const horas = lista
    .filter((c) => c.status === 'resolvido' && c.resolvidoEm)
    .map((c) => (Date.parse(c.resolvidoEm!) - Date.parse(c.criadoEm)) / HORA);

  const meses = Array.from({ length: 6 }, (_, i) => ({
    inicio: new Date(agora.getFullYear(), agora.getMonth() - 5 + i, 1),
    total: 0,
  }));
  for (const c of lista) {
    const d = new Date(c.criadoEm);
    const mes = meses.find((m) => m.inicio.getFullYear() === d.getFullYear() && m.inicio.getMonth() === d.getMonth());
    if (mes) mes.total++;
  }

  return {
    total: lista.length,
    abertos: contar('aberto'),
    emAtendimento: contar('em_atendimento', 'aguardando_peca'),
    aguardandoPeca: contar('aguardando_peca'),
    resolvidos: contar('resolvido'),
    mediaHoras: horas.length ? horas.reduce((a, b) => a + b, 0) / horas.length : null,
    noPrazo: horas.length ? horas.filter((h) => h <= prazoHoras).length / horas.length : null,
    meses,
  };
}
