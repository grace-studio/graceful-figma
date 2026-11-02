import { authHeaders } from './authHeaders.js';
import { FIGMA_API_URL } from './constants.js';
import { fetchOk } from './fetchOk.js';
import { FigmaFile } from './types.js';

/**
 * Fetches a Figma file.
 *
 * @param token - Figma access token
 * @param fileKey - Figma file key
 * @param query - Query string, e.g. `depth=1` or `ids=1:2`
 * @returns The Figma file
 * @throws When the request fails
 */
export const getFile = (
  token: string,
  fileKey: string,
  query: string,
): Promise<FigmaFile> =>
  fetchOk(
    `Fetching Figma file "${fileKey}"`,
    `${FIGMA_API_URL}/files/${fileKey}?${query}`,
    authHeaders(token),
  ).then((response) => response.json());
