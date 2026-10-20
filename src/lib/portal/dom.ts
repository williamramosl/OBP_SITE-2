// Ajudantes para montar a tela a partir dos <template> que o Astro gera.
// Todo texto vindo do usuário entra por textContent, nunca como HTML.
import { statusInfo, type ProblemaId, type StatusId } from '../../data/portal';

export function clonar(id: string): DocumentFragment {
  const tpl = document.getElementById(id);
  if (!(tpl instanceof HTMLTemplateElement)) throw new Error(`Template "${id}" não encontrado.`);
  return tpl.content.cloneNode(true) as DocumentFragment;
}

/** Preenche os elementos marcados com data-campo="nome". */
export function preencher(raiz: ParentNode, campos: Record<string, string>) {
  for (const [campo, valor] of Object.entries(campos)) {
    raiz.querySelectorAll(`[data-campo="${campo}"]`).forEach((el) => {
      el.textContent = valor;
    });
  }
}

/** Selo colorido (.status): a cor vem de data-status no CSS. */
export function aplicarSelo(el: Element | null, status: string, rotulo: string) {
  if (!(el instanceof HTMLElement)) return;
  el.dataset.status = status;
  el.textContent = rotulo;
}

export function aplicarStatus(el: Element | null, status: StatusId) {
  aplicarSelo(el, status, statusInfo[status].label);
}

/** Mensagem curta no rodapé da tela, que some sozinha (o elemento .p-toast fica no layout do portal). */
export function avisar(texto: string) {
  const aviso = document.querySelector<HTMLElement>('.p-toast');
  if (!aviso) return;
  aviso.textContent = texto;
  aviso.classList.add('is-visible');
  clearTimeout(Number(aviso.dataset.timer));
  aviso.dataset.timer = String(window.setTimeout(() => aviso.classList.remove('is-visible'), 3200));
}

/** Copia para a área de transferência. Retorna false se o navegador não permitir. */
export async function copiarTexto(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

/** Copia o ícone do tipo de problema do <template id="portal-icones"> para os elementos com data-icone-problema. */
export function aplicarIcone(raiz: ParentNode, problema: ProblemaId) {
  const banco = document.getElementById('portal-icones');
  if (!(banco instanceof HTMLTemplateElement)) return;
  const icone = banco.content.querySelector(`[data-icone="${problema}"]`) ?? banco.content.querySelector('[data-icone="outro"]');
  raiz.querySelectorAll('[data-icone-problema]').forEach((el) => {
    el.replaceChildren(...(icone ? [...icone.cloneNode(true).childNodes] : []));
  });
}
