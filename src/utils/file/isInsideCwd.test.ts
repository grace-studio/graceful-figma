import { describe, expect, it } from 'vitest';
import { isInsideCwd } from './isInsideCwd.js';

// The output dir is deleted recursively, so only folders inside the project are allowed.
describe('isInsideCwd', () => {
  it.each([
    ['./src/svgs', true],
    ['src/../svgs', true],
    ['..svgs', true],
    ['./', false],
    ['.', false],
    ['../', false],
    ['../sibling', false],
    ['/', false],
  ])('%j -> %j', (target, expected) => {
    expect(isInsideCwd(target)).toBe(expected);
  });
});
