import { escapeXmlAttribute } from '../utils/string/escapeXmlAttribute.js';

/**
 * Adds the `gf-svg` class and a `data-svg-name` attribute to the root `<svg>` tag.
 *
 * @param svg - Svg markup with a root `<svg>` without a class
 * @param svgName - Value of `data-svg-name`, escaped for XML
 * @returns The markup with the attributes on its root
 * @example addRootAttributes('<svg width="1"/>', 'icons/arrow') // '<svg class="gf-svg" data-svg-name="icons/arrow" width="1"/>'
 */
export const addRootAttributes = (svg: string, svgName: string) =>
  svg.replace(
    /<svg\b/,
    `<svg class="gf-svg" data-svg-name="${escapeXmlAttribute(svgName)}"`,
  );
