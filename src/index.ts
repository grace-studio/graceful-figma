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
    .option('-s, --slice <string>', 'icon slice name')
    .action(({ out, key, page, slice }) => {
      if (!out) {
        return console.error('missing output dir');
      }
      if (!key) {
        return console.error('missing project key');
      }
      if (!page) {
        return console.error('missing page name');
      }
      if (!slice) {
        return console.error('missing slice name');
      }

      extractSvg({
        outDir: out,
        iconSliceName: slice,
        pageName: page,
        projectKey: key,
      });
    });

  program.command('help', { isDefault: true }).action(() => {
    program.help();
  });

  program.parse(process.argv);
})();
