import { GracefulConfig, SvgsConfig } from '../types/index.js';
import { isInsideCwd } from '../utils/file/isInsideCwd.js';

/**
 * Merges a command's config with its CLI options and validates the result.
 *
 * @param config - The loaded config file
 * @param command - The command, its config key
 * @param input - CLI options, they override the config
 * @returns The complete command config
 * @throws When `out` is missing or outside the project root, or there are no sources
 */
export const resolveExtractConfig = (
  config: GracefulConfig,
  command: keyof GracefulConfig,
  input: Partial<SvgsConfig>,
): SvgsConfig => {
  const options = { ...config[command], ...input };

  if (!options.out) {
    throw new Error(
      `Missing output dir: set "${command}.out" in the config or pass --out`,
    );
  }

  if (!isInsideCwd(options.out)) {
    throw new Error(
      `Invalid output dir "${options.out}": it must be a folder inside the project root, since it is cleared before writing`,
    );
  }

  if (!options.sources?.length) {
    throw new Error(
      `Missing sources: add at least one Figma source to "${command}.sources" in the config`,
    );
  }

  return { ...options, out: options.out, sources: options.sources };
};
