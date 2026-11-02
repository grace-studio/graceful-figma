import { normalize } from '../utils/string/normalize.js';
import { FigmaNode } from './types.js';

/**
 * Finds the page (canvas) with the given name, ignoring case and surrounding whitespace.
 *
 * @param pageName - Page name to look for
 * @returns A function returning the matching pages in a node tree
 */
export const findPageCanvas =
  (pageName: string) =>
  (node: FigmaNode): FigmaNode[] =>
    normalize(node.name) === normalize(pageName) &&
    normalize(node.type) === 'canvas'
      ? [node]
      : (node.children?.flatMap(findPageCanvas(pageName)) ?? []);
