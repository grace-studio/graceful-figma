import fs from 'node:fs';

/**
 * Loads `.env.local` and `.env` from the cwd into `process.env`.
 * Precedence: shell env > `.env.local` > `.env`, since `process.loadEnvFile`
 * never overrides variables that are already set.
 */
export const loadEnvFiles = () =>
  ['.env.local', '.env']
    .filter((file) => fs.existsSync(file))
    .forEach((file) => process.loadEnvFile(file));
