// Formatação de datas, durações e protocolos da Área do Cliente.

const data = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
const relativo = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const mesAno = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
const numero = new Intl.NumberFormat('pt-BR');

export const protocolo = (id: number) => `#${id}`;

export const formatarData = (iso: string) => data.format(new Date(iso));

export function formatarDataHora(iso: string) {
  const d = new Date(iso);
  return `${data.format(d)} às ${hora.format(d)}`;
}

/** "agora mesmo", "há 3 horas", "ontem", "há 5 dias"; acima de um mês mostra a data. */
export function tempoRelativo(iso: string, agora = Date.now()) {
  const segundos = (Date.parse(iso) - agora) / 1000;
  const abs = Math.abs(segundos);
  if (abs < 60) return 'agora mesmo';
  if (abs < 3600) return relativo.format(Math.round(segundos / 60), 'minute');
  if (abs < 86400) return relativo.format(Math.round(segundos / 3600), 'hour');
  if (abs < 86400 * 30) return relativo.format(Math.round(segundos / 86400), 'day');
  return formatarData(iso);
}

/** 5 → "5 h"; 28 → "1 dia e 4 h". */
export function formatarDuracao(horas: number) {
  if (horas < 1) return 'menos de 1 h';
  const total = Math.round(horas);
  const dias = Math.floor(total / 24);
  const resto = total % 24;
  if (!dias) return `${resto} h`;
  const rotulo = `${dias} ${dias === 1 ? 'dia' : 'dias'}`;
  return resto ? `${rotulo} e ${resto} h` : rotulo;
}

/** Valores guardados em centavos: 203575 → "R$ 2.035,75". */
export const formatarMoeda = (centavos: number) => moeda.format(centavos / 100);

export const formatarNumero = (n: number) => numero.format(n);

/** 1536 → "1,5 KB"; 18_400_000 → "17,5 MB". */
export function formatarTamanho(bytes: number) {
  const um = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 ** 2) return `${um.format(bytes / 1024)} KB`;
  return `${um.format(bytes / 1024 ** 2)} MB`;
}

/** Datas sem hora ("2026-10-10") são lidas no fuso local; new Date("2026-10-10") cairia no dia anterior no Brasil. */
export function dataDoDia(dia: string) {
  const [ano, mes, d] = dia.split('-').map(Number);
  return new Date(ano, mes - 1, d);
}

/** Date → "2026-10-10" no fuso local. */
export function diaDe(data: Date) {
  const mm = String(data.getMonth() + 1).padStart(2, '0');
  const dd = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mm}-${dd}`;
}

export const formatarDia = (dia: string) => data.format(dataDoDia(dia));

/** Diferença em dias entre hoje e a data (negativa se já passou). */
export function diasAte(dia: string, hoje = new Date()) {
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round((dataDoDia(dia).getTime() - inicioHoje.getTime()) / 864e5);
}

/** "2026-09" → "Setembro de 2026" (ou "Set/2026" no formato curto). */
export function formatarCompetencia(competencia: string, curto = false) {
  const d = dataDoDia(`${competencia}-01`);
  if (curto) return `${mesCurto(d)}/${d.getFullYear()}`;
  const texto = mesAno.format(d);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** "Out", "Nov"... */
export function mesCurto(d: Date) {
  const texto = mes.format(d).replace('.', '');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
