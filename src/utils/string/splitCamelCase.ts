/**
 * Separates camelCase/PascalCase words with a space so they survive lowercasing.
 *
 * @param text - Text that may contain camelCase words
 * @returns The text with a space before each inner capital
 * @example splitCamelCase('arrowLeft') // 'arrow Left'
 */
export const splitCamelCase = (text: string) =>
  text.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
