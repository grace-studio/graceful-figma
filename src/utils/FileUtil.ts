import fs from 'fs';
import p from 'path';

const clearPath = (path: string) =>
  fs.rmSync(path, { recursive: true, force: true });

const writeFile = (path: string, fileName: string, content: string) => {
  if (!fs.existsSync(p.resolve(process.cwd(), path))) {
    fs.mkdirSync(path, { recursive: true });
  }

  fs.writeFileSync(p.resolve(process.cwd(), `${path}/${fileName}`), content);
};

const readFile = (path: string) =>
  fs.existsSync(p.resolve(process.cwd(), path))
    ? fs.readFileSync(p.resolve(process.cwd(), path)).toString()
    : null;

export const FileUtil = {
  clearPath,
  writeFile,
  readFile,
};
