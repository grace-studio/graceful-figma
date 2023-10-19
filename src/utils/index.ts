export const clearAndUpper = (text: string) =>
  text.replace(/-|\s|_/g, '').toUpperCase();

export const toPascalCase = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9_-\s]+/g, '')
    .replace(/(^\w|\s\w|-\w|_\w)/g, clearAndUpper)
    .replace(/(?<=\d+)[a-z]/g, clearAndUpper)
    .replace(/^\d+.*/g, (text) => `_${text}`);
