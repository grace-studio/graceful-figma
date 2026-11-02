/**
 * Replaces fill and stroke colors with `currentColor`, so the svg takes the CSS `color`.
 * `none` and gradient references like `url(#paint0)` are kept.
 *
 * @param svg - Svg markup
 * @returns The recolored markup
 * @example inheritCurrentColor('<path fill="#000"/>') // '<path fill="currentColor"/>'
 */
export const inheritCurrentColor = (svg: string) =>
  svg.replace(
    /(fill|stroke)="(?!none")[#a-zA-Z0-9]{2,}"/g,
    '$1="currentColor"',
  );
