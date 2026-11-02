import { FigmaFetchSource } from '../types/index.js';
import { normalize } from '../utils/string/normalize.js';

/**
 * Normalized section names of a source.
 *
 * @param source - Source with an array or comma-separated `sectionName`
 * @returns The normalized section names
 * @example getSectionNames({ sectionName: 'Arrows, Misc' }) // ['arrows', 'misc']
 */
export const getSectionNames = ({ sectionName }: FigmaFetchSource) =>
  (Array.isArray(sectionName) ? sectionName : sectionName.split(',')).map(
    normalize,
  );
