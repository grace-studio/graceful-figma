#!/usr/bin/env -S node

import { Command } from 'commander';
import chalk from 'chalk';
import { extractSvg } from './methods/extractSvg.js';

(() => {
  console.log(chalk.green.bold('Graceful Figma\n'));

  const program = new Command();

  program
    .command('extract-svgs')
    .argument('<outdir>')
    .option('-k, --key <string>', 'project key')
    .option('-p, --page <string>', 'page name')
    .option('-s, --slice <string>', 'icon slice name')
    .action((outdir, { key, page, slice }) => {
      if (!outdir) {
        return console.error('missing outdir');
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
        outDir: outdir,
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
