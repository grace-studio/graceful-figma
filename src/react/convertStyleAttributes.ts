import { SvgComponent } from '../types/index.js';
import { toStyleObject } from './toStyleObject.js';

/**
 * JSX needs `style` as an object, Figma exports it as a string (e.g. on masks).
 *
 * @param component - Component with svg markup in `svg`
 * @returns The component with `style` attributes as JSX objects
 */
export const convertStyleAttributes = ({ svg, ...rest }: SvgComponent) => ({
  ...rest,
  svg: svg.replace(
    /style="([^"]*)"/g,
    (_, style: string) => `style={${toStyleObject(style)}}`,
  ),
});
