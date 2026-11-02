import fs from 'node:fs';
import path from 'node:path';

/**
 * Writes a file, creating its folder when missing.
 *
 * @param folder - Folder to write into, relative to the cwd
 * @param fileName - Name of the file
 * @param content - File content
 */
export const writeFile = (
  folder: string,
  fileName: string,
  content: string,
) => {
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, fileName), content);
};
