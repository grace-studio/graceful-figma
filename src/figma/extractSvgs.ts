import { FigmaFetchSource } from '../types/index.js';
import { createSourceIssue } from './createSourceIssue.js';
import { findComponents } from './findComponents.js';
import { findPageCanvas } from './findPageCanvas.js';
import { findSvgSections } from './findSvgSections.js';
import { getFile } from './getFile.js';
import { getSectionNames } from './getSectionNames.js';
import { getSvgsFromComponents } from './getSvgsFromComponents.js';
import { ExtractResult } from './types.js';

/**
 * Fetches all components in the configured page sections of a Figma file as SVGs.
 * A missing page or a source without components is reported in `errors` so the
 * other sources can still be extracted.
 *
 * @param token - Figma access token
 * @param source - Figma file, page and section(s) to extract from
 * @returns The extracted SVGs and the components that could not be extracted
 * @throws When a Figma API request or SVG download fails
 */
export const extractSvgs = async (
  token: string,
  source: FigmaFetchSource,
): Promise<ExtractResult> => {
  const file = await getFile(token, source.fileKey, 'depth=1');
  const [page] = findPageCanvas(source.pageName)(file.document);

  if (!page) {
    const pageNames = (file.document.children ?? []).map(
      ({ name }) => `"${name}"`,
    );

    return createSourceIssue(
      source,
      file.name,
      `Page "${source.pageName}" not found. Available pages: ${pageNames.join(', ')}`,
    );
  }

  const { document } = await getFile(token, source.fileKey, `ids=${page.id}`);

  const components = findPageCanvas(source.pageName)(document)
    .flatMap(findSvgSections(getSectionNames(source)))
    .flatMap(findComponents);

  if (components.length < 1) {
    return createSourceIssue(
      source,
      file.name,
      'Figma source(s) without valid components',
    );
  }

  return getSvgsFromComponents(token, source, file.name, components);
};
