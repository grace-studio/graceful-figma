import { describe, expect, it } from 'vitest';
import { toPascalCase } from './toPascalCase.js';

// The result becomes a JS identifier in the generated output.
describe('toPascalCase', () => {
  it.each([
    ['arrow left', 'ArrowLeft'],
    ['arrowLeft', 'ArrowLeft'],
    ['tools & ui', 'ToolsUi'],
    ['snake_case-name', 'SnakeCaseName'],
    ['24px close', '_24pxClose'],
  ])('%j -> %j', (input, expected) => {
    expect(toPascalCase(input)).toBe(expected);
  });
});
