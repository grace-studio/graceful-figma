#!/usr/bin/env -S node

import { Command } from 'commander';
import chalk from 'chalk';
import { extractSvg } from './methods/extractSvg.js';

(() => {
  console.log(chalk.green.bold('Graceful Figma\n'));

  const program = new Command();

  program
    .command('react-icons')
    .option('-o, --out <string>', 'output dir')
    .option('-k, --key <string>', 'project key')
    .option('-p, --page <string>', 'page name')
    .option('-s, --section <string>', 'icon section name')
    .action(({ out, key, page, section }) => {
      if (!out) {
        return console.error('missing output dir');
      }
      if (!key) {
        return console.error('missing project key');
      }
      if (!page) {
        return console.error('missing page name');
      }
      if (!section) {
        return console.error('missing section name');
      }

      extractSvg({
        outDir: out,
        iconSectionName: section,
        pageName: page,
        projectKey: key,
      });
    });

  program.command('help', { isDefault: true }).action(() => {
    program.help();
  });

  program.parse(process.argv);
})();
