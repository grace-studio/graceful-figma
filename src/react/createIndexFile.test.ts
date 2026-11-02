import { describe, expect, it } from 'vitest';
import { Component } from '../types/index.js';
import { createIndexFile } from './createIndexFile.js';

const component = (overrides: Partial<Component>): Component => ({
  name: 'Svg',
  section: 'Arrows',
  pageAlias: 'Graceful',
  fileName: 'file/page/arrows/Svg',
  filePath: 'file/page/arrows',
  component: '',
  ...overrides,
});

describe('createIndexFile', () => {
  // SvgByName's name type is derived from this PageAlias.Section.Name shape.
  it('nests lazy imports by page alias and section', async () => {
    const index = await createIndexFile(
      [
        component({ name: 'Left', fileName: 'a/b/arrows/Left' }),
        component({ name: 'Right', fileName: 'a/b/arrows/Right' }),
        component({
          name: 'Logo',
          section: 'brand logos',
          pageAlias: 'Other',
          fileName: 'c/d/brand-logos/Logo',
        }),
      ],
      'Svgs',
    );

    // Ignore prettier's whitespace, quote and trailing comma choices.
    const svgs = index
      .replace(/\s+/g, '')
      .replaceAll('"', "'")
      .replaceAll(',}', '}');
    expect(svgs).toContain(
      "constSvgs={Graceful:{Arrows:{Left:lazy(()=>import('./a/b/arrows/Left')),Right:lazy(()=>import('./a/b/arrows/Right'))}},Other:{BrandLogos:{Logo:lazy(()=>import('./c/d/brand-logos/Logo'))}}};",
    );
  });
});
