export const clearAndUpper = (text: string) =>
  text.replace(/-|\s/g, '').toUpperCase();

export const toPascalCase = (text: string) =>
  text.toLowerCase().replace(/(^\w|\s\w|-\w|_\w)/g, clearAndUpper);
