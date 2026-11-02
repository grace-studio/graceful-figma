import { describe, expect, it } from 'vitest';
import { inheritCurrentColor } from './inheritCurrentColor.js';

describe('inheritCurrentColor', () => {
  it.each([
    ['<path fill="#1E1E1E"/>', '<path fill="currentColor"/>'],
    ['<path stroke="white"/>', '<path stroke="currentColor"/>'],
    [
      '<svg fill="none"><path stroke="none"/></svg>',
      '<svg fill="none"><path stroke="none"/></svg>',
    ],
    ['<path fill="url(#paint0)"/>', '<path fill="url(#paint0)"/>'],
    ['<path fill-rule="evenodd"/>', '<path fill-rule="evenodd"/>'],
  ])('%s → %s', (svg, expected) => {
    expect(inheritCurrentColor(svg)).toBe(expected);
  });
});
