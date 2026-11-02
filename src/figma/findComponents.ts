import { normalize } from '../utils/string/normalize.js';
import { FigmaNode } from './types.js';

/**
 * Finds all components in a node tree, at any depth.
 *
 * @param node - Root node, usually a section
 * @returns The components, each tagged with the root's `section`
 */
export const findComponents = (node: FigmaNode): FigmaNode[] =>
  normalize(node.type) === 'component'
    ? [node]
    : (node.children?.flatMap((child) =>
        findComponents({ ...child, section: node.section }),
      ) ?? []);
