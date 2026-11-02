import { Component } from '../types/index.js';
import { toPascalCase } from '../utils/string/toPascalCase.js';

/**
 * Name of a component in `SvgByName`, its key path in the index file.
 *
 * @param component - A generated component
 * @returns `PageAlias.Section.Name`
 * @example getSvgName({ pageAlias: 'graceful', section: 'Arrows', name: 'Left' }) // 'Graceful.Arrows.Left'
 */
export const getSvgName = ({
  pageAlias,
  section,
  name,
}: Pick<Component, 'pageAlias' | 'section' | 'name'>) =>
  `${toPascalCase(pageAlias)}.${toPascalCase(section)}.${name}`;
