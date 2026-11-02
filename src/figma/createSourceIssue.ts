import { FigmaFetchSource } from '../types/index.js';
import { getPageAlias } from './getPageAlias.js';
import { ExtractResult } from './types.js';

/**
 * Result for a source that could not be extracted at all.
 *
 * @param source - The failing source
 * @param figmaFileName - Name of the Figma file
 * @param description - Why the source failed
 * @returns A result without SVGs and with one error
 */
export const createSourceIssue = (
  source: FigmaFetchSource,
  figmaFileName: string,
  description: string,
): ExtractResult => ({
  svgs: [],
  errors: [
    {
      description,
      figmaComponentName: 'N/A',
      figmaFileName,
      figmaPageName: source.pageName,
      figmaSectionName: [source.sectionName].flat().join(', '),
      pageAlias: getPageAlias(source, figmaFileName),
    },
  ],
});
