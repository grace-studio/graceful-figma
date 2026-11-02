import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { GracefulConfig } from '../types/index.js';

const CONFIG_FILES = [
  'graceful.config.js',
  'graceful.config.mjs',
  'graceful.config.ts',
];

/**
 * Loads the graceful config from the project root (cwd). `.ts` configs are
 * loaded with Node's built-in type stripping, so they must only use erasable
 * syntax (e.g. `import type`, annotations, no enums).
 *
 * @returns The default export of the first config file found, and its file name
 * @throws When no config file exists, it has no default export, or it fails to load
 */
export const loadConfig = async (): Promise<{
  config: GracefulConfig;
  configPath: string;
}> => {
  const configPath = CONFIG_FILES.find((file) =>
    fs.existsSync(path.resolve(process.cwd(), file)),
  );

  if (!configPath) {
    throw new Error(
      'No config file found. Please ensure one of these files exists in your project root:\n' +
        CONFIG_FILES.map((file) => `  - ${file}`).join('\n'),
    );
  }

  const { default: config } = await import(
    pathToFileURL(path.resolve(process.cwd(), configPath)).href
  );

  if (!config) {
    throw new Error(`No default export found in ${configPath}`);
  }

  return { config, configPath };
};
