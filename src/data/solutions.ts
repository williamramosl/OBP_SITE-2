// Conteúdo das soluções. Alimenta a home, o menu, o rodapé, /solucoes/ e as páginas de cada solução.
// Textos baseados no site antigo e ampliados — revisar com a equipe comercial antes de publicar.
import type { ImageMetadata } from 'astro';
import {
  Archive,
  BadgeCheck,
  Calculator,
  ChartColumn,
  Cog,
  FileStack,
  Gauge,
  Headset,
  Leaf,
  Package,
  PackageCheck,
  PiggyBank,
  Printer,
  ScanLine,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
  Wrench,
} from '@lucide/astro';
import outsourcingImg from '../assets/img/outsourcing.jpeg';
import gedImg from '../assets/img/ged.jpeg';
import assistenciaImg from '../assets/img/assistencia.jpeg';

type Icon = typeof Printer;

export type Solution = {
  slug: string;
  name: string;
  short: string;
  icon: Icon;
  tagline: string;
  intro: string;
  /** Bloco visual: foto ou o painel ilustrado de monitoramento */
  visual: { image: ImageMetadata; alt: string; position?: string } | { dashboard: true };
  /** Tema do bloco na home e do topo da página da solução */
  theme: 'light' | 'dark' | 'deep';
  highlights: string[];
  statement: { title: string; text: string };
  benefitsTitle: string;
  benefits: { icon: Icon; title: string; text: string }[];
  includedTitle: string;
  included: string[];
};

export const solutions: Solution[] = [
  {
    slug: 'outsourcing-de-impressao',
    name: 'Outsourcing de Impressão',
    short: 'Outsourcing',
    icon: Printer,
    tagline: 'Todo o parque de impressão. Um só contrato.',
    intro:
      'Equipamentos, suprimentos, manutenção e suporte reunidos em um contrato com custo mensal previsível. Sua equipe imprime. Nós cuidamos de todo o resto.',
    visual: {
      image: outsourcingImg,
      alt: 'Profissional retirando documentos de uma impressora multifuncional',
      position: '50% 30%',
    },
    theme: 'light',
    highlights: ['Custo mensal previsível', 'Suprimentos e manutenção inclusos', 'Equipamentos dimensionados para a sua demanda'],
    statement: {
      title: 'Menos gestão. Mais resultado.',
      text: 'O outsourcing de impressão traz conveniência, eficiência e economia para empresas de todos os setores: uma solução completa para todas as suas necessidades de impressão.',
    },
    benefitsTitle: 'Tudo o que você precisa. Nada com que se preocupar.',
    benefits: [
      { icon: Wallet, title: 'Custo previsível', text: 'Uma mensalidade que cobre equipamentos, suprimentos e manutenção. Sem surpresas no orçamento.' },
      { icon: PiggyBank, title: 'Sem investimento em equipamentos', text: 'Você não imobiliza capital comprando impressoras. Usa equipamentos dimensionados para a sua demanda.' },
      { icon: PackageCheck, title: 'Suprimentos no tempo certo', text: 'Toners e peças são repostos com base no consumo monitorado, antes de acabarem.' },
      { icon: Headset, title: 'Suporte incluso', text: 'Chamados atendidos por técnicos treinados diretamente pelo fabricante.' },
    ],
    includedTitle: 'Tudo em um só contrato.',
    included: [
      'Impressoras e multifuncionais de marcas líderes',
      'Toners e suprimentos',
      'Manutenção preventiva e corretiva',
      'Monitoramento remoto do parque',
      'Relatórios de consumo por setor',
      'Abertura de chamados pela Área do Cliente',
    ],
  },
  {
    slug: 'gestao-de-impressao',
    name: 'Gestão de Impressão',
    short: 'Gestão',
    icon: Gauge,
    tagline: 'Cada página sob controle.',
    intro:
      'Monitore todo o parque de impressão em uma única plataforma. Saiba quem imprime, quanto e onde, e transforme essa informação em economia.',
    visual: { dashboard: true },
    theme: 'dark',
    highlights: ['Monitoramento em tempo real', 'Relatórios por setor e por usuário', 'Políticas que reduzem o desperdício'],
    statement: {
      title: 'O que é medido pode ser reduzido.',
      text: 'Mais do que gerar resultados, a gestão de impressão reduz significativamente os custos por meio do controle e do monitoramento precisos dos recursos. Uma solução completa, com excelente custo-benefício e eficiência operacional.',
    },
    benefitsTitle: 'Controle que se paga.',
    benefits: [
      { icon: ChartColumn, title: 'Visibilidade total', text: 'Volumes por usuário, setor e equipamento em relatórios claros e objetivos.' },
      { icon: SlidersHorizontal, title: 'Regras de impressão', text: 'Cotas e políticas como frente e verso ou preto e branco por padrão.' },
      { icon: Leaf, title: 'Menos desperdício', text: 'Identifique excessos e reduza páginas impressas sem necessidade.' },
      { icon: Calculator, title: 'Custo por setor', text: 'Distribua os gastos de impressão entre centros de custo com precisão.' },
    ],
    includedTitle: 'Uma plataforma. Todo o parque.',
    included: [
      'Monitoramento do parque em tempo real',
      'Relatórios por usuário, setor e equipamento',
      'Alertas de suprimentos e falhas',
      'Políticas e cotas de impressão',
      'Rateio de custos por centro de custo',
      'Acompanhamento de um consultor',
    ],
  },
  {
    slug: 'ged',
    name: 'Gestão Eletrônica de Documentos',
    short: 'GED',
    icon: FileStack,
    tagline: 'Documentos organizados. Em qualquer lugar.',
    intro:
      'Digitalize, organize e encontre qualquer documento em segundos, com soluções personalizadas que se adaptam às demandas do seu mercado.',
    visual: {
      image: gedImg,
      alt: 'Pessoa usando um notebook com ícones de pastas e arquivos digitais',
      position: '50% 55%',
    },
    theme: 'deep',
    highlights: ['Digitalização e indexação', 'Busca em segundos', 'Acesso seguro e controlado'],
    statement: {
      title: 'Menos papel. Mais agilidade.',
      text: 'Oferecemos serviços especializados em gestão de informação e documentação, com soluções exclusivas e personalizadas que se adaptam às demandas de cada mercado em que atuamos.',
    },
    benefitsTitle: 'Seus documentos trabalhando por você.',
    benefits: [
      { icon: ScanLine, title: 'Digitalização', text: 'Arquivos físicos convertidos em documentos digitais pesquisáveis.' },
      { icon: Search, title: 'Busca instantânea', text: 'Encontre contratos, notas e prontuários por palavra-chave ou índice.' },
      { icon: ShieldCheck, title: 'Acesso seguro', text: 'Permissões por usuário e controle de quem acessa cada documento.' },
      { icon: Archive, title: 'Menos espaço físico', text: 'Reduza arquivos de papel e o custo de armazenamento.' },
    ],
    includedTitle: 'Do papel ao digital, de ponta a ponta.',
    included: [
      'Levantamento dos fluxos de documentos',
      'Digitalização e indexação',
      'Armazenamento organizado e seguro',
      'Controle de acesso por usuário',
      'Integração com as multifuncionais',
      'Treinamento da equipe',
    ],
  },
  {
    slug: 'assistencia-tecnica',
    name: 'Assistência Técnica',
    short: 'Assistência',
    icon: Wrench,
    tagline: 'Técnicos certificados. Peças à pronta entrega.',
    intro:
      'Manutenção feita por profissionais treinados diretamente pelo fabricante, com peças e suprimentos originais e compatíveis.',
    visual: {
      image: assistenciaImg,
      alt: 'Técnico fazendo manutenção interna em uma impressora',
      position: '50% 40%',
    },
    theme: 'light',
    highlights: ['Técnicos treinados pelo fabricante', 'Peças originais e compatíveis', 'Atendimento multimarcas'],
    statement: {
      title: 'Excelência em cada atendimento.',
      text: 'Nossos técnicos são treinados diretamente pelo fabricante. Também oferecemos peças e suprimentos originais e similares, com opções para cada necessidade e orçamento.',
    },
    benefitsTitle: 'Sua operação sempre funcionando.',
    benefits: [
      { icon: BadgeCheck, title: 'Técnicos certificados', text: 'Profissionais treinados diretamente pelos fabricantes.' },
      { icon: Cog, title: 'Preventiva e corretiva', text: 'Manutenção programada para evitar paradas e atendimento ágil quando algo falha.' },
      { icon: Package, title: 'Peças e suprimentos', text: 'Originais e compatíveis, com opções para cada orçamento.' },
      { icon: Printer, title: 'Multimarcas', text: 'Brother, Canon, HP, Kyocera, Ricoh e Samsung.' },
    ],
    includedTitle: 'Serviços disponíveis.',
    included: [
      'Diagnóstico técnico',
      'Manutenção preventiva programada',
      'Manutenção corretiva',
      'Peças originais e compatíveis',
      'Toners e suprimentos',
      'Atendimento multimarcas',
    ],
  },
];

export const solutionHref = (slug: string) => `/solucoes/${slug}/`;
/** Link de proposta que já chega ao formulário com o interesse selecionado */
export const proposalHref = (slug?: string) => (slug ? `/contato/?interesse=${slug}` : '/contato/');
