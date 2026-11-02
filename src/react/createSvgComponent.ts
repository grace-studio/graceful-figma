import { Component, SvgComponent } from '../types/index.js';
import { formatTypescript } from './formatTypescript.js';
import { svgComponentTemplate } from './svgComponentTemplate.js';

/**
 * Creates the source of a React component for an svg.
 *
 * @param svgComponent - Component with JSX children in `svg` and its size
 * @returns The component with its formatted TSX source
 * @throws When the generated source is not valid TSX
 */
export const createSvgComponent = async (
  svgComponent: SvgComponent,
): Promise<Component> => ({
  name: svgComponent.name,
  section: svgComponent.section,
  fileName: svgComponent.fileName,
  filePath: svgComponent.filePath,
  pageAlias: svgComponent.pageAlias,
  component: await formatTypescript(svgComponentTemplate(svgComponent)),
});
