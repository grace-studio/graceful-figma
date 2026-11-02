/**
 * Normalizes a name for case and whitespace insensitive matching.
 *
 * @param text - Name to normalize
 * @returns The trimmed, lowercased text
 * @example normalize(' Icons ') // 'icons'
 */
export const normalize = (text: string) => text.trim().toLowerCase();
