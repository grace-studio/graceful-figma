/**
 * Fetch options authenticating against the Figma API.
 *
 * @param token - Figma access token
 * @returns `RequestInit` with the Figma token header
 */
export const authHeaders = (token: string): RequestInit => ({
  headers: { 'X-Figma-Token': token },
});
