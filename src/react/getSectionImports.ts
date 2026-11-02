import { Component } from '../types/index.js';
import { toPascalCase } from '../utils/string/toPascalCase.js';

/**
 * Object literal entries grouping lazy component imports by section.
 *
 * @param components - Components of one page alias
 * @returns Source like `Arrows: {Left: lazy(() => import('./...'))}`
 */
export const getSectionImports = (components: Component[]) =>
  Object.entries(Object.groupBy(components, ({ section }) => section))
    .map(
      ([section, sectionComponents = []]) =>
        `${toPascalCase(section)}: {${sectionComponents
          .map(
            ({ name, fileName }) =>
              `${name}: lazy(() => import('./${fileName}'))`,
          )
          .join()}}`,
    )
    .join();
