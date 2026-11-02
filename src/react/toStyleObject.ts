import { dashToCamel } from '../utils/string/dashToCamel.js';

/**
 * Converts an inline CSS string to a JSX style object literal.
 *
 * @param style - Inline CSS, e.g. from a `style` attribute
 * @returns The style object as source code
 * @example toStyleObject('mask-type:alpha') // '{"maskType":"alpha"}'
 */
export const toStyleObject = (style: string) =>
  JSON.stringify(
    Object.fromEntries(
      style
        .split(';')
        .filter((declaration) => declaration.includes(':'))
        .map((declaration) => {
          const [property, ...value] = declaration.split(':');

          return [dashToCamel(property.trim()), value.join(':').trim()];
        }),
    ),
  );
