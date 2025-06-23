import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './app/db/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'sqlite.db',
  },
});