// Remessas de boletos enviadas para impressão e entrega.
// Cada remessa (um arquivo) e cada boleto dentro dela passam por: Enviado → Processando → Entregue.
// Na demonstração os dados ficam só neste navegador e o arquivo não sai do computador (guardamos nome, tamanho e SHA-256).
// TODO(supabase): enviar o arquivo ao armazenamento privado e trocar por tabelas remessas, remessa_boletos e remessa_eventos.
import { demoCliente, demoEmpreendimentos, remessaArquivos, type RemessaStatus } from '../../data/portal';
import { diaDe } from './formato';

export interface BoletoRemessa {
  id: string;
  unidade: string;
  pagador: string;
  vencimento: string;
  /** Centavos. */
  valor: number;
  status: RemessaStatus;
  entregueEm?: string;
}

export interface EventoRemessa {
  em: string;
  autor: 'cliente' | 'equipe';
  mensagem: string;
  status?: RemessaStatus;
}

export interface Remessa {
  /** Protocolo. */
  id: number;
  empreendimento: string;
  /** Mês de vencimento dos boletos, "AAAA-MM". */
  referencia: string;
  arquivo: { nome: string; tamanho: number; sha256: string };
  quantidadeInformada: number;
  observacao?: string;
  enviadoPor: string;
  status: RemessaStatus;
  enviadoEm: string;
  processandoEm?: string;
  entregueEm?: string;
  /** Preenchida quando a equipe confere o arquivo (a partir de "Processando"). */
  boletos: BoletoRemessa[];
  eventos: EventoRemessa[];
}

export type NovaRemessa = Pick<Remessa, 'empreendimento' | 'referencia' | 'arquivo' | 'quantidadeInformada' | 'observacao'>;

const CHAVE = 'obp-portal-demo:remessas:v1';
const HORA = 36e5;

// ---------- Dados de exemplo ----------

const NOMES = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Larissa', 'Marcos', 'Natália', 'Otávio', 'Paula', 'Rafael'];
const SOBRENOMES = ['Almeida', 'Barbosa', 'Costa', 'Dias', 'Ferreira', 'Gomes', 'Lima', 'Moreira', 'Nunes', 'Oliveira', 'Pereira', 'Rocha', 'Santos', 'Teixeira'];

const iso = (ms: number) => new Date(ms).toISOString();

/** Hash fictício e estável para os exemplos (gerador pseudoaleatório simples). */
function hashExemplo(id: number) {
  let x = (id * 2654435761) >>> 0;
  return Array.from({ length: 64 }, () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return (x >>> 28).toString(16);
  }).join('');
}

function unidades(empreendimento: string, total: number) {
  return Array.from({ length: total }, (_, i) =>
    empreendimento === demoEmpreendimentos[0]
      ? `Torre ${i % 2 ? 'B' : 'A'} · Apto ${Math.floor(i / 2 / 4) + 1}0${(Math.floor(i / 2) % 4) + 1}`
      : `Apto ${Math.floor(i / 4) + 1}0${(i % 4) + 1}`,
  );
}

function gerarBoletos(remessaId: number, empreendimento: string, referencia: string, total: number) {
  const [ano, mes] = referencia.split('-').map(Number);
  const vencimento = diaDe(new Date(ano, mes - 1, 10));
  return unidades(empreendimento, total).map((unidade, i): BoletoRemessa => ({
    id: `${remessaId}-${String(i + 1).padStart(3, '0')}`,
    unidade,
    pagador: `${NOMES[(i * 5 + remessaId) % NOMES.length]} ${SOBRENOMES[(i * 3 + remessaId) % SOBRENOMES.length]}`,
    vencimento,
    valor: 185000 + ((i * 37 + remessaId * 11) % 23) * 4500,
    status: 'enviado',
  }));
}

interface Exemplo {
  id: number;
  empreendimento: string;
  /** Mês de vencimento dos boletos em relação ao mês atual (0 = este mês). */
  referencia: number;
  boletos: number;
  enviadoHorasAtras: number;
  /** Horas depois do envio. */
  processando?: number;
  entregue?: number;
  /** Na remessa em andamento: quantos boletos já foram entregues e quantos estão em produção. */
  parcial?: { entregues: number; processando: number };
}

function exemplo(e: Exemplo): Remessa {
  const hoje = new Date();
  const ref = new Date(hoje.getFullYear(), hoje.getMonth() + e.referencia, 1);
  const referencia = diaDe(ref).slice(0, 7);
  const enviado = Date.now() - e.enviadoHorasAtras * HORA;
  const sigla = e.empreendimento.split(' ').slice(1).join('').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  const nomeArquivo = `${sigla}_${referencia.replace('-', '')}.EXT`;
  const remessa: Remessa = {
    id: e.id,
    empreendimento: e.empreendimento,
    referencia,
    arquivo: { nome: nomeArquivo, tamanho: 18_400 * e.boletos + 3_210, sha256: hashExemplo(e.id) },
    quantidadeInformada: e.boletos,
    enviadoPor: demoCliente.nome,
    status: 'enviado',
    enviadoEm: iso(enviado),
    boletos: [],
    eventos: [{ em: iso(enviado), autor: 'cliente', mensagem: 'Arquivo recebido pela Área do Cliente.', status: 'enviado' }],
  };

  if (e.processando !== undefined) {
    const quando = enviado + e.processando * HORA;
    remessa.status = 'processando';
    remessa.processandoEm = iso(quando);
    remessa.boletos = gerarBoletos(e.id, e.empreendimento, referencia, e.boletos);
    remessa.eventos.push({
      em: iso(quando),
      autor: 'equipe',
      mensagem: `Arquivo conferido: ${e.boletos} boletos, igual ao informado. Impressão iniciada.`,
      status: 'processando',
    });
  }

  if (e.entregue !== undefined) {
    const quando = enviado + e.entregue * HORA;
    remessa.status = 'entregue';
    remessa.entregueEm = iso(quando);
    remessa.boletos.forEach((b, i) => {
      b.status = 'entregue';
      b.entregueEm = iso(quando - ((i * 13) % 9) * HORA);
    });
    remessa.eventos.push({
      em: iso(quando),
      autor: 'equipe',
      mensagem: `Todos os ${e.boletos} boletos foram entregues.`,
      status: 'entregue',
    });
  } else if (e.parcial) {
    const inicio = Date.parse(remessa.processandoEm!);
    remessa.boletos.forEach((b, i) => {
      if (i < e.parcial!.entregues) {
        b.status = 'entregue';
        b.entregueEm = iso(inicio + (6 + (i % 5)) * HORA);
      } else if (i < e.parcial!.entregues + e.parcial!.processando) {
        b.status = 'processando';
      }
    });
    remessa.eventos.push({
      em: iso(inicio + 6 * HORA),
      autor: 'equipe',
      mensagem: 'Primeiros boletos impressos e saindo para entrega.',
    });
  }

  return remessa;
}

function exemplos(): Remessa[] {
  const [vistaMar, jardimCamburi] = demoEmpreendimentos;
  return [
    exemplo({ id: 2033, empreendimento: jardimCamburi, referencia: 1, boletos: 16, enviadoHorasAtras: 2 }),
    exemplo({ id: 2032, empreendimento: vistaMar, referencia: 1, boletos: 24, enviadoHorasAtras: 30, processando: 3, parcial: { entregues: 10, processando: 9 } }),
    exemplo({ id: 2031, empreendimento: jardimCamburi, referencia: 0, boletos: 16, enviadoHorasAtras: 30 * 24, processando: 2, entregue: 44 }),
    exemplo({ id: 2030, empreendimento: vistaMar, referencia: 0, boletos: 24, enviadoHorasAtras: 31 * 24, processando: 4, entregue: 52 }),
    exemplo({ id: 2029, empreendimento: jardimCamburi, referencia: -1, boletos: 16, enviadoHorasAtras: 61 * 24, processando: 1, entregue: 38 }),
    exemplo({ id: 2028, empreendimento: vistaMar, referencia: -1, boletos: 24, enviadoHorasAtras: 62 * 24, processando: 5, entregue: 49 }),
  ];
}

// ---------- Armazenamento ----------

let memoria: Remessa[] | null = null;

function ler(): Remessa[] {
  if (memoria) return memoria;
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) return (memoria = JSON.parse(salvo) as Remessa[]);
  } catch {
    // Sem acesso ao armazenamento: segue só em memória.
  }
  memoria = exemplos();
  gravar();
  return memoria;
}

function gravar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(memoria));
  } catch {
    // Idem.
  }
}

// ---------- Arquivo ----------

/** Confere extensão, tamanho e o começo do conteúdo. Retorna a mensagem de erro ou null. */
export async function validarArquivo(arquivo: File): Promise<string | null> {
  const extensao = arquivo.name.split('.').pop()?.toLowerCase() ?? '';
  if (!remessaArquivos.extensoes.includes(extensao)) {
    return 'Formato não aceito. Envie um arquivo .EXT, .TXT, .REM, .CSV, .PDF ou .ZIP.';
  }
  if (arquivo.size === 0) return 'O arquivo está vazio.';
  if (arquivo.size > remessaArquivos.maxBytes) return 'O arquivo passa de 50 MB. Divida em partes ou compacte em .ZIP.';

  const inicio = new Uint8Array(await arquivo.slice(0, 1024).arrayBuffer());
  const comeca = (...bytes: number[]) => bytes.every((b, i) => inicio[i] === b);
  if (extensao === 'pdf' && !comeca(0x25, 0x50, 0x44, 0x46)) return 'Este arquivo não parece ser um PDF válido.';
  if (extensao === 'zip' && !comeca(0x50, 0x4b)) return 'Este arquivo não parece ser um .ZIP válido.';
  if (['ext', 'txt', 'rem', 'csv'].includes(extensao) && inicio.includes(0)) {
    return 'Este arquivo não parece ser de texto. Confira se escolheu o arquivo certo.';
  }
  return null;
}

/** "Impressão digital" do arquivo: confirma que ele chegou íntegro e detecta envios repetidos. */
export async function calcularSha256(arquivo: File) {
  const resumo = await crypto.subtle.digest('SHA-256', await arquivo.arrayBuffer());
  return [...new Uint8Array(resumo)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------- API usada pelas páginas ----------

export async function listarRemessas(): Promise<Remessa[]> {
  return structuredClone(ler()).sort((a, b) => b.enviadoEm.localeCompare(a.enviadoEm));
}

export async function obterRemessa(id: number): Promise<Remessa | null> {
  return structuredClone(ler().find((r) => r.id === id) ?? null);
}

/** Remessa já enviada com o mesmo arquivo (mesmo SHA-256), se houver. */
export async function remessaComMesmoArquivo(sha256: string): Promise<Remessa | null> {
  return structuredClone(ler().find((r) => r.arquivo.sha256 === sha256) ?? null);
}

export async function enviarRemessa(dados: NovaRemessa): Promise<Remessa> {
  const lista = ler();
  const agora = new Date().toISOString();
  const remessa: Remessa = {
    ...dados,
    id: Math.max(2000, ...lista.map((r) => r.id)) + 1,
    enviadoPor: demoCliente.nome,
    status: 'enviado',
    enviadoEm: agora,
    boletos: [],
    eventos: [{ em: agora, autor: 'cliente', mensagem: 'Arquivo recebido pela Área do Cliente.', status: 'enviado' }],
  };
  lista.push(remessa);
  gravar();
  return structuredClone(remessa);
}

/** Índice da etapa atual (0, 1 ou 2), usado nas trilhas de progresso. */
export const etapaDe = (status: RemessaStatus) => ({ enviado: 0, processando: 1, entregue: 2 })[status];

export function contarBoletos(remessa: Remessa) {
  const contar = (s: RemessaStatus) => remessa.boletos.filter((b) => b.status === s).length;
  const total = remessa.boletos.length || remessa.quantidadeInformada;
  return { total, enviado: contar('enviado'), processando: contar('processando'), entregue: contar('entregue') };
}

export function resumirRemessas(lista: Remessa[], hoje = new Date()) {
  const mes = diaDe(hoje).slice(0, 7);
  const noMes = (iso?: string) => Boolean(iso && diaDe(new Date(iso)).startsWith(mes));
  const horas = lista
    .filter((r) => r.entregueEm)
    .map((r) => (Date.parse(r.entregueEm!) - Date.parse(r.enviadoEm)) / HORA);

  return {
    emAndamento: lista.filter((r) => r.status !== 'entregue'),
    remessasNoMes: lista.filter((r) => noMes(r.enviadoEm)).length,
    boletosEntreguesNoMes: lista.flatMap((r) => r.boletos).filter((b) => noMes(b.entregueEm)).length,
    mediaHorasEntrega: horas.length ? horas.reduce((a, b) => a + b, 0) / horas.length : null,
  };
}
