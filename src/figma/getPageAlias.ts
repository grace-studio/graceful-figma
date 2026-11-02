import { FigmaFetchSource } from '../types/index.js';
import { toKebabCase } from '../utils/string/toKebabCase.js';
import { toPascalCase } from '../utils/string/toPascalCase.js';

/**
 * Top level key of a source in the generated index.
 *
 * @param source - Figma source, its `alias` wins when set
 * @param figmaFileName - Name of the Figma file
 * @returns The PascalCase alias
 * @example getPageAlias({ pageName: 'logos', ... }, 'My File') // 'MyFileLogos'
 */
export const getPageAlias = (source: FigmaFetchSource, figmaFileName: string) =>
  toPascalCase(
    source.alias ??
      `${toKebabCase(figmaFileName)} ${toKebabCase(source.pageName)}`,
  );
