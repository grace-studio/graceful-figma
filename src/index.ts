#!/usr/bin/env -S node

import { Command } from 'commander';
import chalk from 'chalk';
import { extractSvg } from './methods/extractSvg.js';
import { GracefulConfig, ReactIconsConfig } from './types/index.js';
import { loadConfig } from './utils/configLoader.js';

export type { GracefulConfig };

(async () => {
  console.log(chalk.green.bold('Graceful Figma\n'));

  let config: GracefulConfig;

  try {
    const { config: loadedConfig } = await loadConfig();
    config = loadedConfig;
  } catch (error) {
    console.error(
      chalk.red('Error: Could not load graceful config file from project root'),
    );
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error)),
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
