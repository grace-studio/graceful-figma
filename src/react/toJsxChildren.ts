import { extractSvgChildren } from '../svg/extractSvgChildren.js';
import { SvgComponent } from '../types/index.js';
import { applyReactAttributeNamingConvention } from './applyReactAttributeNamingConvention.js';
import { convertStyleAttributes } from './convertStyleAttributes.js';

/**
 * Turns a Figma SVG export into JSX-ready svg children plus its width/height.
 *
 * @param component - Component with the raw SVG markup in `svg`
 * @returns The component with `svg` replaced by JSX children
 */
export const toJsxChildren = (component: SvgComponent) =>
  extractSvgChildren(
    convertStyleAttributes(applyReactAttributeNamingConvention(component)),
  );
