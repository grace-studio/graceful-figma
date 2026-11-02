import chalk from 'chalk';
import { extractSvgs } from '../figma/extractSvgs.js';
import { SvgsConfig } from '../types/index.js';
import { promptForRun } from './promptForRun.js';
import { splitDuplicates } from './splitDuplicates.js';

/**
 * Asks to run, then pulls the svgs of all sources from Figma.
 *
 * @param config - The command config, `token` falls back to `FIGMA_ACCESS_TOKEN`
 * @returns The unique svgs, duplicates and failures, or undefined when the user declined
 * @throws When a Figma request fails
 */
export const fetchSvgs = async ({
  out,
  token: configToken,
  ...options
}: SvgsConfig) => {
  const token = await promptForRun({
    out,
    token: process.env.FIGMA_ACCESS_TOKEN || configToken,
    force: options.force,
  });

  if (!token) {
    return undefined;
  }

  console.log(
    chalk.green.dim(
      `Extracting svgs with options:\n${JSON.stringify(options, null, 1)}\n`,
    ),
  );

  const results = await Promise.all(
    options.sources.map((source) => extractSvgs(token, source)),
  );

  return {
    errors: results.flatMap((result) => result.errors),
    ...splitDuplicates(results.flatMap((result) => result.svgs)),
  };
};
