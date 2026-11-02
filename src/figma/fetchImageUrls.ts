import { splitToChunks } from '../utils/array/splitToChunks.js';
import { authHeaders } from './authHeaders.js';
import { FIGMA_API_URL } from './constants.js';
import { fetchOk } from './fetchOk.js';

/** Max node ids per Figma images request, keeps URLs short and renders within Figma's timeout. */
const IMAGE_BATCH_SIZE = 50;

/**
 * Renders Figma nodes as SVG, in batches.
 *
 * @param token - Figma access token
 * @param fileKey - Figma file key
 * @param ids - Node ids to render
 * @returns Download URL per node id, `null` when Figma could not render it
 * @throws When a request fails
 */
export const fetchImageUrls = async (
  token: string,
  fileKey: string,
  ids: string[],
): Promise<Record<string, string | null>> => {
  const batches: Record<string, string | null>[] = [];

  // Sequential on purpose, to stay clear of Figma's rate limits.
  for (const batch of splitToChunks(ids, IMAGE_BATCH_SIZE)) {
    const { images } = await fetchOk(
      `Rendering SVGs in Figma file "${fileKey}"`,
      `${FIGMA_API_URL}/images/${fileKey}?ids=${batch.join()}&format=svg`,
      authHeaders(token),
    ).then((response) => response.json());

    batches.push(images);
  }

  return Object.assign({}, ...batches);
};
