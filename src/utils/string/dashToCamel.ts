/**
 * Converts dash-case to camelCase.
 *
 * @param text - Dash-case text, e.g. an SVG attribute name
 * @returns The camelCased text
 * @example dashToCamel('fill-rule') // 'fillRule'
 */
export const dashToCamel = (text: string) =>
  text.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
