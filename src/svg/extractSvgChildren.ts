import { SvgComponent } from '../types/index.js';

/**
 * Replaces the svg markup with the root's children and reads its size.
 *
 * @param component - Component with full svg markup in `svg`
 * @returns The component with `svg` set to the root's children, whitespace between tags removed
 */
export const extractSvgChildren = ({
  svg,
  ...rest
}: SvgComponent): SvgComponent => {
  const svgStr = svg.replace(/\s+/g, ' ').trim();

  const widthMatch = svgStr.match(/width=["']([\d.]+)(px|%)?["']/);
  const heightMatch = svgStr.match(/height=["']([\d.]+)(px|%)?["']/);
  const childrenMatch = svgStr.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);

  return {
    ...rest,
    width: widthMatch ? Number(widthMatch[1]) : undefined,
    height: heightMatch ? Number(heightMatch[1]) : undefined,
    svg: (childrenMatch ? childrenMatch[1].trim() : '').replace(/>\s+</g, '><'),
  };
};
