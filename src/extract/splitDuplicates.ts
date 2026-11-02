import { ComponentIssue, SvgComponent } from '../types/index.js';

/**
 * Keeps the first svg per file name, later ones are reported as duplicates.
 *
 * @param svgs - All extracted svgs
 * @returns The unique svgs, and the duplicates as issues
 */
export const splitDuplicates = (svgs: SvgComponent[]) => {
  // Built from the reversed list so the first svg per file name wins.
  const firstByFileName = new Map(
    svgs.toReversed().map((svg) => [svg.fileName, svg]),
  );
  const isFirst = (svg: SvgComponent) =>
    firstByFileName.get(svg.fileName) === svg;

  return {
    unique: svgs.filter(isFirst),
    duplicates: svgs
      .filter((svg) => !isFirst(svg))
      .map((svg): ComponentIssue => ({
        ...svg,
        description: 'Component has duplicate filename',
      })),
  };
};
