import { splitToChunks } from '../utils/array/splitToChunks.js';
import { toPascalCase } from '../utils/string/toPascalCase.js';
import { fetchOk } from './fetchOk.js';

/** Max parallel SVG downloads. */
const SVG_DOWNLOAD_BATCH_SIZE = 20;

/**
 * Downloads rendered SVGs, a batch at a time.
 *
 * @param components - Rendered components with their SVG download URL
 * @returns The SVG markup with the component's names
 * @throws When a download fails
 */
export const downloadSvgs = async (
  components: { name: string; section: string; url: string }[],
) => {
  const svgs = [];

  for (const batch of splitToChunks(components, SVG_DOWNLOAD_BATCH_SIZE)) {
    const batchSvgs = await Promise.all(
      batch.map(({ url, name, section }) =>
        fetchOk(`Downloading SVG for "${name}"`, url)
          .then((response) => response.text())
          .then((svg) => ({
            svg,
            figmaComponentName: name,
            name: toPascalCase(name),
            section,
          })),
      ),
    );

    svgs.push(...batchSvgs);
  }

  return svgs;
};
