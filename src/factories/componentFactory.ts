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

const IconByName: FC<IconProps & { name: keyof typeof Icons }> = ({
  name,
  ...props
}) => {
  const ImportedIcon = Icons[name] as unknown as ComponentType<IconProps>;

  return ImportedIcon ? <ImportedIcon {...props} /> : null;
};

export default IconByName;
`;

export const ComponentFactory = {
  createIcon,
  createIndexFile,
  createIconByName,
};
