// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.officebrasilprint.com.br',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  // Permite que o preview do app escolha a porta (via PORT) quando a 4321 já estiver em uso.
  server: { port: Number(process.env.PORT) || 4321 },
});
