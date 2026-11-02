import fs from 'node:fs';
import { isInsideCwd } from './isInsideCwd.js';

/**
 * Recursively deletes `target`.
 *
 * @param target - Folder or file to delete
 * @throws When `target` is not inside the cwd, to never wipe the project or anything outside it
 */
export const clearPath = (target: string) => {
  if (!isInsideCwd(target)) {
    throw new Error(
      `Refusing to delete "${target}": the output dir must be a folder inside the project root`,
    );
  }

  fs.rmSync(target, { recursive: true, force: true });
};
