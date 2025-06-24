const capitalize = (s: string) => s.charAt(0).toUpperCase();

export const dashToCamel = (attr: string) =>
  attr.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

export const toPascalCase = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '') // remove non-word characters
    .replace(/(?:^|[\s_-]+)(\w)/g, (_, c) => capitalize(c)) // capitalize first letters
    .replace(/^\d/, (d) => `_${d}`); // prepend underscore if starting with digit

export const toKebabCase = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]+/g, '') // remove unwanted characters
    .replace(/[_\s]+/g, '-') // replace spaces and underscores with hyphen
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
