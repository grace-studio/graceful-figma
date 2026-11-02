import path from 'node:path';

/**
 * Whether `target` resolves to a path strictly inside the cwd (not the cwd itself).
 *
 * @param target - Relative or absolute path
 * @returns True when `target` is inside the cwd
 * @example isInsideCwd('./src/svgs') // true
 * @example isInsideCwd('../') // false
 */
export const isInsideCwd = (target: string) => {
  const relative = path.relative(
    process.cwd(),
    path.resolve(process.cwd(), target),
  );

  return (
    relative !== '' &&
    !path.isAbsolute(relative) &&
    relative.split(path.sep)[0] !== '..'
  );
};
