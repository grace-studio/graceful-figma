#!/usr/bin/env -S node

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { extractSvg } from './methods/extractSvg.js';
import { GracefulConfig, ReactIconsConfig } from './types/index.js';

export type { GracefulConfig };

(async () => {
  console.log(chalk.green.bold('Graceful Figma\n'));

  let config: GracefulConfig;

  // Try to load config file (support both .ts and .js extensions)
  const configFiles = ['graceful.config.ts', 'graceful.config.js', 'graceful.config.mjs'];
  let configModule;
  let loadedConfigPath;

  for (const configFile of configFiles) {
    try {
      const configPath = path.resolve(process.cwd(), configFile);
      // Use file:// URL for better cross-platform compatibility
      configModule = await import(`file://${configPath}`);
      loadedConfigPath = configFile;
      break;
    } catch (error) {
      // Continue to next config file
      continue;
    }
  }

  if (!configModule) {
    console.error(
      chalk.red(
        'Error: Could not load graceful config file from project root',
      ),
    );
    console.error(
      chalk.red(
        'Please ensure one of these files exists in your project root:',
      ),
    );
    console.error(
      chalk.red(
        '  - graceful.config.ts\n  - graceful.config.js\n  - graceful.config.mjs',
      ),
    );
    process.exit(1);
  }

  config = configModule.default;
  if (!config) {
    console.error(
      chalk.red(
        `Error: No config exported from ${loadedConfigPath}`,
      ),
    );
    console.error(
      chalk.red(
        'Please ensure your config file exports a default config object',
      ),
    );
    process.exit(1);
  }

  const program = new Command();

  program
    .command('react-icons')
    .option('-o, --out <string>', 'output dir')
    .option('-f, --force [boolean]', 'icon section name')
    .action((input) => {
      const options: ReactIconsConfig = {
        ...config['react-icons'],
        ...input,
      };

      if (!options.out) {
        return console.error('missing output dir');
      }

      extractSvg({ ...options });
    });

  program.command('help', { isDefault: true }).action(() => {
    program.help();
  });

  program.parse(process.argv);
})();
