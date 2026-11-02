import { describe, expect, it } from 'vitest';
import { addRootAttributes } from './addRootAttributes.js';

describe('addRootAttributes', () => {
  it.each([
    ['icons/arrow left', 'data-svg-name="icons/arrow left"'],
    [
      'logos/R&D "new" <v2>',
      'data-svg-name="logos/R&amp;D &quot;new&quot; &lt;v2>"',
    ],
  ])('tags only the root svg with %s', (svgName, expected) => {
    expect(addRootAttributes('<svg width="1"><svg/></svg>', svgName)).toBe(
      `<svg class="gf-svg" ${expected} width="1"><svg/></svg>`,
    );
  });
});
