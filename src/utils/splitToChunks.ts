export const splitToChunks = <T>(arr: T[], size: number): T[][] =>
  [...Array(Math.ceil(arr.length / size))].map((_, index) =>
    arr.slice(index * size, (index + 1) * size),
  );
