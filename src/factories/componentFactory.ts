import { Component, SvgComponent } from '../types/index.js';
import { groupBy } from '../utils/groupBy.js';
import { toPascalCase } from '../utils/index.js';

const createIcon = ({
  width,
  height,
  svg,
  name,
  ...rest
}: SvgComponent): Component => ({
  name,
  component: `import { IconWrapper, IconProps } from '@grace-studio/graceful-next/components';

const ${name} = (props: IconProps) => (
  <IconWrapper {...props} ${width ? ` width={${width}}` : ''} ${
    height ? ` height={${height}}` : ''
  }>
    ${svg}
  </IconWrapper>
);

export default ${name};

`,
  ...rest,
});

const createIndexFile = (components: Component[]) => {
  const sections = Object.entries(
    groupBy(components, ({ section }) => section),
  ).map(([section, sectionComponents]) => ({
    section,
    componentImports: sectionComponents
      .map(
        ({ name, fileName }) =>
          `    ${name}: dynamic(() => import('./${fileName}'))`,
      )
      .join(',\n'),
  }));

  return `import dynamic from 'next/dynamic';

const Icons = {
${sections
  .map(
    ({ section, componentImports }) =>
      `  ${toPascalCase(section)}: {\n${componentImports}\n  }`,
  )
  .join(',\n')}
};

export default Icons;

`;
};

const createIconByName = () =>
  `import { ComponentType, FC } from 'react';
import Icons from '.';
import { IconProps } from '@grace-studio/graceful-next/components';

type Paths<T> = T extends object
  ? {
      [K in keyof T]-?: K extends object
        ? never
        : ${'`${K & string}.${keyof T[K] & string}`'};
    }[keyof T]
  : '';

const IconByName: FC<IconProps & { name: Paths<typeof Icons> }> = ({
  name,
  ...props
}) => {
  const [section, icon] = name.split('.');
  const Section = Icons[section as keyof typeof Icons];

  if (!Section) {
    return null;
  }

  const ImportedIcon = Section[
    icon as keyof typeof Section
  ] as unknown as ComponentType<IconProps>;

  return ImportedIcon ? <ImportedIcon {...props} /> : null;
};

export default IconByName;
`;

export const ComponentFactory = {
  createIcon,
  createIndexFile,
  createIconByName,
};
