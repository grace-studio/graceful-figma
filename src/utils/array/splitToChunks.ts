/**
 * Splits an array into chunks of at most `size` items.
 *
 * @param items - Items to split
 * @param size - Max items per chunk
 * @returns The chunks, in order
 * @example splitToChunks([1, 2, 3], 2) // [[1, 2], [3]]
 */
export const splitToChunks = <T>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  );
