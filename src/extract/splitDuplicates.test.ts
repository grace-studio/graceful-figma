import { describe, expect, it } from 'vitest';
import { SvgComponent } from '../types/index.js';
import { splitDuplicates } from './splitDuplicates.js';

const svg = (fileName: string, svgMarkup: string) =>
  ({ fileName, svg: svgMarkup }) as SvgComponent;

describe('splitDuplicates', () => {
  it('keeps the first svg per file name and reports the rest', () => {
    const { unique, duplicates } = splitDuplicates([
      svg('a/One', 'first'),
      svg('a/Two', 'only'),
      svg('a/One', 'second'),
      svg('a/One', 'third'),
    ]);

    expect(unique.map(({ svg }) => svg)).toEqual(['first', 'only']);
    expect(duplicates).toEqual([
      expect.objectContaining({ fileName: 'a/One', svg: 'second' }),
      expect.objectContaining({ fileName: 'a/One', svg: 'third' }),
    ]);
  });
});
