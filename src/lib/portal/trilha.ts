// Trilha de progresso Enviado → Processando → Entregue (remessas e boletos).
import { remessaEtapas, type RemessaStatus } from '../../data/portal';
import { etapaDe } from './remessas';

interface Opcoes {
  /** Só os pontos, para listas. */
  compacta?: boolean;
  /** Texto exibido abaixo de cada etapa (ex.: data em que aconteceu). */
  datas?: (string | undefined)[];
}

export function montarTrilha(status: RemessaStatus, { compacta = false, datas = [] }: Opcoes = {}) {
  const atual = etapaDe(status);
  const trilha = document.createElement('ol');
  trilha.className = compacta ? 'trilha trilha--mini' : 'trilha';
  if (compacta) trilha.setAttribute('aria-hidden', 'true');

  remessaEtapas.forEach((etapa, i) => {
    const passo = document.createElement('li');
    passo.className = 'trilha__passo';
    passo.classList.toggle('is-feito', i <= atual);
    passo.classList.toggle('is-atual', i === atual);
    passo.classList.toggle('is-final', status === 'entregue' && i === atual);
    if (i === atual) passo.setAttribute('aria-current', 'step');

    const ponto = document.createElement('span');
    ponto.className = 'trilha__ponto';
    const nome = document.createElement('span');
    nome.className = 'trilha__nome';
    nome.textContent = etapa.label;
    passo.append(ponto, nome);

    if (datas[i]) {
      const data = document.createElement('span');
      data.className = 'trilha__data';
      data.textContent = datas[i]!;
      passo.append(data);
    }
    trilha.append(passo);
  });
  return trilha;
}
