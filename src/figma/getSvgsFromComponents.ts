import { inheritCurrentColor } from '../svg/inheritCurrentColor.js';
import { ComponentIssue, FigmaFetchSource } from '../types/index.js';
import { toKebabCase } from '../utils/string/toKebabCase.js';
import { toPascalCase } from '../utils/string/toPascalCase.js';
import { downloadSvgs } from './downloadSvgs.js';
import { fetchImageUrls } from './fetchImageUrls.js';
import { getPageAlias } from './getPageAlias.js';
import { ExtractResult, FigmaNode } from './types.js';

/**
 * Renders and downloads components as SVG, with colors replaced by `currentColor` unless the source opts out.
 *
 * @param token - Figma access token
 * @param source - Figma source the components are from
 * @param figmaFileName - Name of the Figma file
 * @param components - Components to extract
 * @returns The SVGs sorted by file name, and the components Figma could not render
 * @throws When a request or download fails
 */
export const getSvgsFromComponents = async (
  token: string,
  source: FigmaFetchSource,
  figmaFileName: string,
  components: FigmaNode[],
): Promise<ExtractResult> => {
  const pageAlias = getPageAlias(source, figmaFileName);
  const imageUrls = await fetchImageUrls(
    token,
    source.fileKey,
    components.map(({ id }) => id),
  );

  const rendered = components.map(({ id, name, section }) => ({
    name,
    section,
    url: imageUrls[id],
  }));

  const errors: ComponentIssue[] = rendered
    .filter(({ url }) => !url)
    .map(({ name, section }) => ({
      description: 'Failed to fetch component image URL',
      figmaComponentName: name,
      figmaFileName,
      figmaPageName: source.pageName,
      figmaSectionName: section,
      pageAlias,
    }));

  const svgs = await downloadSvgs(
    rendered.filter(
      (component): component is typeof component & { url: string } =>
        Boolean(component.url),
    ),
  );

  const basePath = `${toKebabCase(figmaFileName)}/${toKebabCase(source.pageName)}`;

  return {
    svgs: svgs
      .map((component) => ({
        ...component,
        svg:
          (source.shouldUseCurrentColor ?? true)
            ? inheritCurrentColor(component.svg)
            : component.svg,
        figmaPageName: source.pageName,
        figmaFileName,
        figmaSectionName: component.section,
        section: toPascalCase(component.section),
        fileName: `${basePath}/${toKebabCase(component.section)}/${component.name}`,
        filePath: `${basePath}/${toKebabCase(component.section)}`,
        pageAlias,
      }))
      .sort((a, b) => a.fileName.localeCompare(b.fileName)),
    errors,
  };
};
