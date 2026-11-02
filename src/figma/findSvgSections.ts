import { normalize } from '../utils/string/normalize.js';
import { FigmaNode } from './types.js';

/**
 * Finds the sections to extract SVGs from.
 *
 * @param sectionNames - Normalized section names to look for
 * @returns A function returning the matching sections in a node tree, tagged with their `section`
 */
export const findSvgSections =
  (sectionNames: string[]) =>
  (node: FigmaNode): FigmaNode[] =>
    sectionNames.includes(normalize(node.name)) &&
    normalize(node.type) === 'section'
      ? [{ ...node, section: node.name.toLowerCase() }]
      : (node.children?.flatMap(findSvgSections(sectionNames)) ?? []);
