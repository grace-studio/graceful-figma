import fs from 'fs';

const clearPath = (path: string) =>
  fs.rmSync(path, { recursive: true, force: true });

const writeFile = (path: string, fileName: string, content: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  fs.writeFileSync(`${path}/${fileName}`, content);
};

export const FileUtil = {
  clearPath,
  writeFile,
};
