// Monta uma linha de chamado a partir do <template id="tpl-linha-chamado">.
import { equipamentoPorId, portalRoutes, problemaTitulo } from '../../data/portal';
import type { Chamado } from './chamados';
import { aplicarIcone, aplicarStatus, clonar, preencher } from './dom';
import { formatarData, protocolo } from './formato';

export function montarLinha(chamado: Chamado) {
  const linha = clonar('tpl-linha-chamado');
  const equipamento = equipamentoPorId(chamado.equipamentoId);
  linha.querySelector('a')?.setAttribute('href', portalRoutes.chamado(chamado.id));
  aplicarIcone(linha, chamado.problema);
  aplicarStatus(linha.querySelector('[data-status-pill]'), chamado.status);
  preencher(linha, {
    protocolo: protocolo(chamado.id),
    titulo: problemaTitulo(chamado.problema),
    descricao: chamado.descricao,
    equipamento: equipamento?.modelo ?? 'Equipamento não informado',
    local: equipamento?.local ?? '',
    data: formatarData(chamado.criadoEm),
  });
  return linha;
}
