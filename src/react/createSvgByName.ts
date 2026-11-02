import { formatTypescript } from './formatTypescript.js';

/**
 * Creates `SvgByName/index.tsx`, rendering an svg by its `PageAlias.Section.Name` inside a `Suspense` boundary.
 *
 * @returns The formatted TSX source
 */
export const createSvgByName = () =>
  formatTypescript(
    `import { Suspense, type SVGProps } from 'react';
import { svgsByName } from './svgsByName';
import type { SvgName } from './types';

export type { SvgName } from './types';

/** Props of \`SvgByName\`: svg props plus the name of the svg to render */
export type SvgByNameProps = SVGProps<SVGSVGElement> & { name: SvgName };

/** Renders a generated svg by name, nothing for an unknown name. */
const SvgByName = ({ name, ...props }: SvgByNameProps) => {
  // Names can come from untyped data, like a CMS.
  if (!(name in svgsByName)) {
    return null;
  }

  const Svg = svgsByName[name];

  return (
    <Suspense fallback={null}>
      <Svg {...props} />
    </Suspense>
  );
};

export default SvgByName;
`,
  );
