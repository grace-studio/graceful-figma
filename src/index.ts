#!/usr/bin/env -S node

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { extractSvg } from './methods/extractSvg.js';
import { GracefulConfig, ReactIconsConfig } from './types/index.js';

(async () => {
  console.log(chalk.green.bold('Graceful Figma\n'));

  let config: GracefulConfig;
  try {
    const configPath = path.resolve(process.cwd(), 'graceful.config.ts');
    const configModule = await import(configPath);
    config = configModule.default;
    if (!config) {
      throw new Error('No config exported from graceful.config.ts');
    }
  } catch (error) {
    console.error(
      chalk.red(
        'Error: Could not load graceful.config.ts file from project root',
      ),
    );
    console.error(
      chalk.red(
        'Please ensure graceful.config.ts exists in your project root and exports a valid config',
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
