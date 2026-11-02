import { splitCamelCase } from './splitCamelCase.js';

/**
 * Converts text to a PascalCase JS identifier.
 *
 * @param text - Any text, e.g. a Figma component name
 * @returns PascalCase text, prefixed with `_` when it would start with a digit
 * @example toPascalCase('arrow-left') // 'ArrowLeft'
 * @example toPascalCase('24px close') // '_24pxClose'
 */
export const toPascalCase = (text: string) =>
  splitCamelCase(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '') // remove non-word characters
    .replace(/(?:^|[\s_-]+)(\w)/g, (_, letter: string) => letter.toUpperCase())
    .replace(/^\d/, (digit) => `_${digit}`); // identifiers can't start with a digit
