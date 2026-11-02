/**
 * `fetch` that throws a readable error for non-2xx responses.
 *
 * @param label - What the request does, used as the error message prefix
 * @param url - URL to fetch
 * @param init - Fetch options
 * @returns The ok response
 * @throws When the response is not ok, including Figma's `err`/`message` when present
 */
export const fetchOk = async (
  label: string,
  url: string,
  init?: RequestInit,
) => {
  const response = await fetch(url, init);

  if (response.ok) {
    return response;
  }

  const detail = await response
    .json()
    .then(
      (body: { err?: string; message?: string }) => body.err ?? body.message,
    )
    .catch(() => undefined);

  const status = [response.status, response.statusText]
    .filter(Boolean)
    .join(' ');

  throw new Error(`${label} failed (${status})${detail ? `: ${detail}` : ''}`);
};
