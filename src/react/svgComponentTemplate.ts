import { SvgComponent } from '../types/index.js';
import { escapeXmlAttribute } from '../utils/string/escapeXmlAttribute.js';

/**
 * Source of a React component rendering an svg.
 *
 * @param component - Component with JSX children in `svg` and its size
 * @returns Unformatted TSX source
 */
export const svgComponentTemplate = ({
  width,
  height,
  svg,
  name,
  filePath,
  figmaComponentName,
}: Pick<
  SvgComponent,
  'height' | 'width' | 'name' | 'svg' | 'filePath' | 'figmaComponentName'
>) => `import type { SVGProps } from 'react';

  const ${name} = ({
    className = "",
    ...props
  }: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-svg-name="${escapeXmlAttribute(`${filePath}/${figmaComponentName}`)}"
      width={${width}}
      height={${height}}
      fill="none"
      viewBox="0 0 ${width} ${height}"
      className={\`\${className} gf-svg\`.trim()}
      {...props}
    >
      ${svg}
    </svg>
  );

  export default ${name};`;
