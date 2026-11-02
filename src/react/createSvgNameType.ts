import { Component } from '../types/index.js';
import { formatTypescript } from './formatTypescript.js';
import { getSvgName } from './getSvgName.js';

/**
 * Creates `SvgByName/types.ts` with a literal union of all svg names.
 *
 * @param components - All generated components
 * @returns The formatted TS source
 */
export const createSvgNameType = (components: Component[]) => {
  const names = components
    .map(getSvgName)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => `| '${name}'`);

  return formatTypescript(
    `/** Name of a generated svg, as PageAlias.Section.Name */
export type SvgName = ${names.join('\n') || 'never'};`,
  );
};
