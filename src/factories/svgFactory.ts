import { SvgComponent } from '../types/index.js';
import { dashToCamel } from '../utils/index.js';

const extractSvgChildren = ({ svg, ...rest }: SvgComponent): SvgComponent => {
  const svgStr = svg.replace(/\s+/g, ' ').trim();

  const widthMatch = svgStr.match(/width=["']([\d.]+)(px|%)?["']/);
  const heightMatch = svgStr.match(/height=["']([\d.]+)(px|%)?["']/);
  const childrenMatch = svgStr.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);

  const width = widthMatch ? Number(widthMatch[1]) : undefined;
  const height = heightMatch ? Number(heightMatch[1]) : undefined;
  const children = childrenMatch ? childrenMatch[1].trim() : '';

  return {
    ...rest,
    width,
    height,
    svg: children,
  };
};

const applyReactAttributeNamingConvention = ({
  svg,
  ...rest
}: SvgComponent) => ({
  ...rest,
  svg: svg.replace(/\b([a-z][\w:-]*)(?=\s*=)/g, (match) => {
    // Only convert attributes, skip data-*, aria-*, xlink:
    if (/^(data|aria)-/.test(match) || match.includes(':')) return match;
    return dashToCamel(match);
  }),
});

const removeFill = ({ svg, ...rest }: SvgComponent) => ({
  ...rest,
  svg: svg.replace(/fill="[#a-zA-Z0-9]{2,}"/gm, ''),
});

export const SvgFactory = {
  applyReactAttributeNamingConvention,
  removeFill,
  extractSvgChildren,
};
