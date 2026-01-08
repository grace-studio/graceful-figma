import { Component, SvgComponent } from '../types/index.js';
import { groupBy } from '../utils/groupBy.js';
import { toPascalCase } from '../utils/index.js';
import * as prettier from 'prettier';

const svgComponent = ({
  width,
  height,
  svg,
  name,
}: Pick<
  SvgComponent,
  'height' | 'width' | 'name' | 'svg'
>) => `import type { SVGProps } from 'react';
  
  const ${name} = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      viewBox="0 0 ${width} ${height}"
      {...props}
    >
      ${svg}
    </svg>
  );
  
  export default ${name};`;

const createIcon = async ({
  width,
  height,
  svg,
  name,
  ...rest
}: SvgComponent): Promise<Component> => {
  const component = await prettier.format(
    svgComponent({ width, height, svg, name }),
    { parser: 'typescript' },
  );

  return {
    name,
    component,
    ...rest,
  };
};

const getSectionImports = (components: Component[]) =>
  Object.entries(groupBy(components, ({ section }) => section))
    .map(([section, sectionComponents]) => ({
      section,
      componentImports: sectionComponents
        .map(
          ({ name, fileName }) =>
            `${name}: dynamic(() => import('./${fileName}'))`,
        )
        .join(),
    }))
    .map(
      ({ section, componentImports }) =>
        `${toPascalCase(section)}: {${componentImports}}`,
    )
    .join();

const createIndexFile = (components: Component[], componentName: string) => {
  const groupedImports = Object.entries(
    groupBy(components, ({ pageAlias }) => pageAlias),
  )
    .map(
      ([pageAlias, pageAliasComponents]) =>
        `${toPascalCase(pageAlias)}: {${getSectionImports(pageAliasComponents)}}`,
    )
    .join();

  return prettier.format(
    `import dynamic from 'next/dynamic';

  const ${componentName} = {${groupedImports}};

  export default ${componentName};`,
    { parser: 'typescript' },
  );
};

const specialThing = '`${K1 & string}.${K2 & string}.${K3 & string}`';
const createIconByName = () =>
  prettier.format(
    `import type { ComponentType, FC, SVGProps } from 'react';
import Icons from '.';

type Paths<T> = {
  [K1 in keyof T]: T[K1] extends object
    ? {
        [K2 in keyof T[K1]]: T[K1][K2] extends object
          ? {
              [K3 in keyof T[K1][K2]]: ${specialThing};
            }[keyof T[K1][K2]]
          : never;
      }[keyof T[K1]]
    : never;
}[keyof T];

const IconByName: FC<
  SVGProps<SVGSVGElement> & { name: Paths<typeof Icons> }
> = ({ name, ...props }) => {
  if (!name) {
    return null;
  }

  const path = name.split('.');
  let current: any = Icons;

  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }

  const ImportedIcon = current as ComponentType<SVGProps<SVGSVGElement>>;
  
  return ImportedIcon ? <ImportedIcon {...props} /> : null;
};


export default IconByName;
`,
    { parser: 'typescript' },
  );

export const ComponentFactory = {
  createIcon,
  createIndexFile,
  createIconByName,
};
