import path from 'node:path';
import { addRootAttributes } from '../svg/addRootAttributes.js';
import { SvgsConfig } from '../types/index.js';
import { clearPath } from '../utils/file/clearPath.js';
import { writeFile } from '../utils/file/writeFile.js';
import { toKebabCase } from '../utils/string/toKebabCase.js';
import { fetchSvgs } from './fetchSvgs.js';
import { logExtraction } from './logExtraction.js';

/**
 * Pulls svgs from Figma and writes them as `.svg` files, in a folder per Figma file, page and section.
 *
 * @param config - The `svgs` config
 * @throws When a Figma request fails or the output dir is not inside the project root
 */
export const extractSvgFiles = async (config: SvgsConfig) => {
  const fetched = await fetchSvgs(config);

  if (!fetched) {
    return;
  }

  const files = fetched.unique.map(
    ({ filePath, name, figmaComponentName, svg }) => ({
      filePath,
      fileName: `${toKebabCase(name)}.svg`,
      svg: addRootAttributes(svg, `${filePath}/${figmaComponentName}`),
    }),
  );

  clearPath(config.out);
  files.forEach(({ filePath, fileName, svg }) =>
    writeFile(path.join(config.out, filePath), fileName, svg),
  );

  logExtraction({
    fileNames: files.map(({ filePath, fileName }) => `${filePath}/${fileName}`),
    errors: fetched.errors,
    duplicates: fetched.duplicates,
  });
};
