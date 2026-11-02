import * as prettier from 'prettier';

/**
 * Formats generated TypeScript/TSX source.
 *
 * @param source - Source code
 * @returns The formatted source
 * @throws When the source is not valid TypeScript
 */
export const formatTypescript = (source: string) =>
  prettier.format(source, { parser: 'typescript' });
