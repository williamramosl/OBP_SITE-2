// @ts-check
import { defineConfig } from 'astro/config';

// Na Vercel, o endereço do site é o domínio de produção do projeto (o domínio próprio, quando houver,
// senão o .vercel.app). Assim o link canônico e a imagem da prévia apontam para onde o site está no ar.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site: vercelHost ? `https://${vercelHost}` : 'https://www.officebrasilprint.com.br',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  // Permite que o preview do app escolha a porta (via PORT) quando a 4321 já estiver em uso.
  server: { port: Number(process.env.PORT) || 4321 },
});
