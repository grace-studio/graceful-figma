/** Characters that would break an XML or JSX attribute value. */
const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '"': '&quot;',
  '<': '&lt;',
};

/**
 * Escapes text for a double-quoted XML attribute. JSX decodes the same entities in string attributes.
 *
 * @param text - Any text, e.g. a Figma component name
 * @returns The escaped text
 * @example escapeXmlAttribute('R&D "new"') // 'R&amp;D &quot;new&quot;'
 */
export const escapeXmlAttribute = (text: string) =>
  text.replace(/[&"<]/g, (character) => XML_ESCAPES[character]);
