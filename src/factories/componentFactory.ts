import { Component, SvgComponent } from '../types/index.js';

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

const createIndexFile = (
  components: Component[],
) => `import dynamic from 'next/dynamic';

const Icons = {
${components
  .map(
    ({ name, fileName }) => `  ${name}: dynamic(() => import('./${fileName}'))`,
  )
  .join(',\n')}
};

export default Icons;

`;

const createIconByName = () =>
  `import { FC } from 'react';
import Icons from '.';
import { IconProps } from '@grace-studio/graceful-next/components';

const IconByName: FC<IconProps & { name: keyof typeof Icons }> = ({
  name,
  ...props
}) => {
  const ImportedIcon = Icons[name];

  return <ImportedIcon {...props} />;
};

export default IconByName;
`;

export const ComponentFactory = {
  createIcon,
  createIndexFile,
  createIconByName,
};
