import { describe, expect, it } from 'vitest';
import { toKebabCase } from './toKebabCase.js';

// The result becomes a folder name in the generated output.
describe('toKebabCase', () => {
  it.each([
    ['Tools & UI', 'tools-ui'],
    ['GracefulIcons', 'graceful-icons'],
    ['  My_File   Name ', 'my-file-name'],
    ['--a--b--', 'a-b'],
  ])('%j -> %j', (input, expected) => {
    expect(toKebabCase(input)).toBe(expected);
  });
});
