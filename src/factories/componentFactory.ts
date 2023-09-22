import { Component, SvgComponent } from '../types/index.js';

const createIcon = ({
  width,
  height,
  children,
  name,
}: SvgComponent): Component => ({
  name,
  component: `
import { IconWrapper, IconProps } from '@grace-studio/graceful-next/components';

const ${name} = (props: IconProps) => (
  <IconWrapper {...props} ${width ? ` width={${width}}` : ''} ${
    height ? ` height={${height}}` : ''
  }>
    ${children}
  </IconWrapper>
);

export default ${name};

`,
});

const createIndexFile = (components: Component[]) => `
import dynamic from 'next/dynamic';

const Icons = {
${components
  .map(({ name }) => `  ${name}: dynamic(() => import('./icons/${name}'))`)
  .join(',\n')}
};

export default Icons;

`;

export const ComponentFactory = {
  createIcon,
  createIndexFile,
};
