import path from 'node:path';
import { createIndexFile } from '../react/createIndexFile.js';
import { createSvgByName } from '../react/createSvgByName.js';
import { createSvgComponent } from '../react/createSvgComponent.js';
import { createSvgNameType } from '../react/createSvgNameType.js';
import { createSvgsByName } from '../react/createSvgsByName.js';
import { toJsxChildren } from '../react/toJsxChildren.js';
import { SvgsConfig } from '../types/index.js';
import { clearPath } from '../utils/file/clearPath.js';
import { writeFile } from '../utils/file/writeFile.js';
import { toPascalCase } from '../utils/string/toPascalCase.js';
import { fetchSvgs } from './fetchSvgs.js';
import { logExtraction } from './logExtraction.js';

/**
 * Pulls svgs from Figma and writes them as React components, plus an index and a typed `SvgByName` component.
 *
 * @param config - The `react-svgs` config
 * @throws When a Figma request fails or the output dir is not inside the project root
 */
export const extractReactSvgs = async (config: SvgsConfig) => {
  const fetched = await fetchSvgs(config);

  if (!fetched) {
    return;
  }

  const components = await Promise.all(
    fetched.unique.map(toJsxChildren).map(createSvgComponent),
  );
  const index = await createIndexFile(
    components,
    toPascalCase(path.basename(config.out) || 'svgs'),
  );
  const svgByName = await createSvgByName();
  const svgsByName = await createSvgsByName(components);
  const svgNameType = await createSvgNameType(components);

  clearPath(config.out);
  writeFile(config.out, 'index.tsx', index);
  writeFile(path.join(config.out, 'SvgByName'), 'index.tsx', svgByName);
  writeFile(path.join(config.out, 'SvgByName'), 'svgsByName.ts', svgsByName);
  writeFile(path.join(config.out, 'SvgByName'), 'types.ts', svgNameType);
  components.forEach(({ name, filePath, component }) =>
    writeFile(path.join(config.out, filePath), `${name}.tsx`, component),
  );

  logExtraction({
    fileNames: components.map(({ fileName }) => fileName),
    errors: fetched.errors,
    duplicates: fetched.duplicates,
  });
};
