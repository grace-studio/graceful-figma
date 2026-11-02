import { describe, expect, it } from 'vitest';
import { Component } from '../types/index.js';
import { createSvgsByName } from './createSvgsByName.js';
import { createSvgNameType } from './createSvgNameType.js';

const components: Component[] = [
  {
    name: 'Right',
    section: 'Arrows',
    pageAlias: 'Graceful',
    fileName: '',
    filePath: '',
    component: '',
  },
  {
    name: 'Logo',
    section: 'brand logos',
    pageAlias: 'other alias',
    fileName: '',
    filePath: '',
    component: '',
  },
];

describe('svgsByName', () => {
  // The names must match the key paths createIndexFile generates.
  it('maps each name to its key path in the index and lists the names as a type', async () => {
    const [svgsByName, types] = await Promise.all([
      createSvgsByName(components),
      createSvgNameType(components),
    ]);
    const normalize = (source: string) =>
      source.replace(/\s+/g, ' ').replaceAll('"', "'");

    expect(normalize(svgsByName)).toContain(
      "'Graceful.Arrows.Right': Svgs.Graceful.Arrows.Right, 'OtherAlias.BrandLogos.Logo': Svgs.OtherAlias.BrandLogos.Logo,",
    );
    expect(normalize(types)).toContain(
      "export type SvgName = 'Graceful.Arrows.Right' | 'OtherAlias.BrandLogos.Logo';",
    );
  });

  it('types an empty set of svgs as never', async () => {
    expect(await createSvgNameType([])).toContain(
      'export type SvgName = never;',
    );
  });
});
