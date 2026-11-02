import { splitCamelCase } from './splitCamelCase.js';

/**
 * Converts text to kebab-case, safe for file and folder names.
 *
 * @param text - Any text, e.g. a Figma file or section name
 * @returns kebab-case text
 * @example toKebabCase('Tools & UI') // 'tools-ui'
 */
export const toKebabCase = (text: string) =>
  splitCamelCase(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]+/g, '') // remove unwanted characters
    .replace(/[_\s]+/g, '-') // replace spaces and underscores with hyphen
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
