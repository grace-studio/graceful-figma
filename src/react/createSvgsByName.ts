import { Component } from '../types/index.js';
import { formatTypescript } from './formatTypescript.js';
import { getSvgName } from './getSvgName.js';

/**
 * Creates `SvgByName/svgsByName.ts`, mapping each svg name to its lazy component in the index.
 *
 * @param components - All generated components
 * @returns The formatted TS source
 */
export const createSvgsByName = (components: Component[]) => {
  const entries = components.map((component) => {
    const name = getSvgName(component);

    return `'${name}': Svgs.${name}`;
  });

  return formatTypescript(
    `import type { ComponentType, SVGProps } from 'react';
import Svgs from '..';
import type { SvgName } from './types';

/** Lazy svg components by name */
export const svgsByName = {${entries.join()}} satisfies Record<SvgName, ComponentType<SVGProps<SVGSVGElement>>>;
`,
  );
};
