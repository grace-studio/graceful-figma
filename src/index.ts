#!/usr/bin/env -S node

import { Command } from 'commander';
import chalk from 'chalk';
import { extractSvg } from './methods/extractSvg.js';
import { FileUtil } from './utils/FileUtil.js';
import { Config, ExtractSvgOptions } from './types/index.js';

(() => {
  console.log(chalk.green.bold('Graceful Figma\n'));
  const config: Config = JSON.parse(
    FileUtil.readFile('.gracefulrc.json') || '{}',
  );

  const program = new Command();

  program
    .command('react-icons')
    .option('-o, --out <string>', 'output dir')
    .option('-k, --key <string>', 'project key')
    .option('-p, --page <string>', 'page name')
    .option('-s, --section <string>', 'icon section name')
    .option('-f, --force [boolean]', 'icon section name')
    .action((input) => {
      const options: ExtractSvgOptions = {
        ...config['react-icons'],
        ...input,
      };

      if (!options.out) {
        return console.error('missing output dir');
      }
      if (!options.key) {
        return console.error('missing project key');
      }
      if (!options.page) {
        return console.error('missing page name');
      }
      if (!options.section) {
        return console.error('missing section name');
      }

      extractSvg({ ...options, token: config.token });
    });

  program.command('help', { isDefault: true }).action(() => {
    program.help();
  });

  program.parse(process.argv);
})();
