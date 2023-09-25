import { SvgComponent } from '../types/index.js';
import { clearAndUpper } from '../utils/index.js';

const extractSvgChildren = ({ svg, ...rest }: SvgComponent): SvgComponent => {
  const svgStr = svg.replaceAll('\n', '');
  const width = (svgStr.match(/(?<=width=")\d+(?=")/) || [])[0];
  const height = (svgStr.match(/(?<=height=")\d+(?=")/) || [])[0];
  const children = (svgStr.match(/(?<=<svg.*>).+(?=<\/svg>)/) || [''])[0];

  return {
    ...rest,
    width: width ? Number(width) : undefined,
    height: height ? Number(height) : undefined,
    svg: children,
  };
};

const applyReactAttributeNamingConvention = ({
  svg,
  ...rest
}: SvgComponent) => ({
  ...rest,
  svg: svg.replace(/-[a-z](?=.+=")/gm, clearAndUpper),
});

const removeFill = ({ svg, ...rest }: SvgComponent) => ({
  ...rest,
  svg: svg.replace(/fill="#[a-fA-F0-9]{6}"/gm, ''),
});

export const SvgFactory = {
  applyReactAttributeNamingConvention,
  removeFill,
  extractSvgChildren,
};
