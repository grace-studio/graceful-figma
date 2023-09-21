#!/usr/bin/env -S node

import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import { extractSvg } from './methods/extractSvg.js';

(() => {
  console.log(chalk.green(figlet.textSync('Graceful Figma')));

  const program = new Command();

  program
    .version('x.y.z')
    .description('CLI for extracting stuff from Figma')
    .option('-s, --svg', 'extract SVGs')
    .parse(process.argv);

  const options = program.opts();

  if (options.svg) {
    extractSvg();

    return;
  }
})();
