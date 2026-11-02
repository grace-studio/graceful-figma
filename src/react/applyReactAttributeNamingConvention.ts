import { SvgComponent } from '../types/index.js';
import { dashToCamel } from '../utils/string/dashToCamel.js';

/**
 * Renames dash-case svg attributes to their React names, e.g. `fill-rule` -> `fillRule`.
 * `data-*`, `aria-*` and namespaced (`xlink:href`) attributes are kept.
 *
 * @param component - Component with svg markup in `svg`
 * @returns The component with React attribute names in `svg`
 */
export const applyReactAttributeNamingConvention = ({
  svg,
  ...rest
}: SvgComponent) => ({
  ...rest,
  svg: svg.replace(/\b([a-z][\w:-]*)(?=\s*=)/g, (attribute) =>
    /^(data|aria)-/.test(attribute) || attribute.includes(':')
      ? attribute
      : dashToCamel(attribute),
  ),
});
