#!/usr/bin/env -S node

import { Command } from 'commander';
import chalk from 'chalk';
import { extractSvg } from './methods/extractSvg.js';
import { FileUtil } from './utils/FileUtil.js';
import { Config, ReactIconsConfig } from './types/index.js';

(() => {
  console.log(chalk.green.bold('Graceful Figma\n'));
  const config: Config = JSON.parse(
    FileUtil.readFile('.gracefulrc.json') || '{}',
  );

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
