# Office Brasil Print — site

Site institucional da Office Brasil Print, feito com [Astro](https://astro.build).

## Rodar localmente

Requer Node.js 22.12 ou mais recente.

```bash
npm install
npm run dev
```

O site abre em http://localhost:4321.

## Gerar a versão de produção

```bash
npm run build
```

O resultado fica em `dist/` (HTML, CSS e imagens otimizadas), pronto para qualquer hospedagem estática.

## Onde mexer

- `src/data/site.ts` — telefone, WhatsApp, e-mail, redes sociais e links do menu
- `src/data/solutions.ts` — textos e imagens das soluções
- `src/pages/` — uma pasta ou arquivo por página
- `src/assets/` — fotos e logos dos fabricantes (o Astro otimiza no build)
- `src/styles/global.css` — cores, fontes e estilos base
