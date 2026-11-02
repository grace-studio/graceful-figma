import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig } from './config/loadConfig.js';
import { loadEnvFiles } from './config/loadEnvFiles.js';
import { resolveExtractConfig } from './config/resolveExtractConfig.js';
import { extractReactSvgs } from './extract/extractReactSvgs.js';
import { extractSvgFiles } from './extract/extractSvgFiles.js';
import { SvgsConfig } from './types/index.js';

const commands = [
  {
    name: 'svgs',
    description: 'pull svgs from Figma into .svg files',
    extract: extractSvgFiles,
  },
  {
    name: 'react-svgs',
    description: 'pull svgs from Figma into React components',
    extract: extractReactSvgs,
  },
] as const;

const run = async () => {
  console.log(chalk.green.bold('Graceful Figma\n'));

  loadEnvFiles();

  const { config } = await loadConfig().catch((error: unknown) => {
    throw new Error(
      `Could not load graceful config file from project root\n${error instanceof Error ? error.message : String(error)}`,
    );
  });

  const program = new Command();

  commands.forEach(({ name, description, extract }) =>
    program
      .command(name)
      .description(description)
      .option('-o, --out <string>', 'output dir, cleared before writing')
      .option(
        '-f, --force [boolean]',
        'skip the confirmation before clearing the output dir',
        (value) => value !== 'false',
      )
      .action((input: Partial<SvgsConfig>) =>
        extract(resolveExtractConfig(config, name, input)),
      ),
  );

  program.command('help', { isDefault: true }).action(() => {
    program.help();
  });

  await program.parseAsync(process.argv);
};

run().catch((error: unknown) => {
  console.error(
    chalk.red(`Error: ${error instanceof Error ? error.message : error}`),
  );
  process.exit(1);
});
