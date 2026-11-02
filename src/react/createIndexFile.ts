import { Component } from '../types/index.js';
import { toPascalCase } from '../utils/string/toPascalCase.js';
import { formatTypescript } from './formatTypescript.js';
import { getSectionImports } from './getSectionImports.js';

/**
 * Creates the index file: an object of `React.lazy` imports nested as PageAlias.Section.Name.
 *
 * @param components - All generated components
 * @param componentName - Name of the exported object
 * @returns The formatted TSX source
 */
export const createIndexFile = (
  components: Component[],
  componentName: string,
) => {
  const groupedImports = Object.entries(
    Object.groupBy(components, ({ pageAlias }) => pageAlias),
  )
    .map(
      ([pageAlias, pageAliasComponents = []]) =>
        `${toPascalCase(pageAlias)}: {${getSectionImports(pageAliasComponents)}}`,
    )
    .join();

  return formatTypescript(
    `import { lazy } from 'react';

  const ${componentName} = {${groupedImports}};

  export default ${componentName};`,
  );
};
