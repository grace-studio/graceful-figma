import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadConfig } from './loadConfig.js';

const projectWith = (files: Record<string, string>) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'graceful-config-'));
  Object.entries(files).forEach(([name, content]) =>
    fs.writeFileSync(path.join(dir, name), content),
  );
  vi.spyOn(process, 'cwd').mockReturnValue(dir);
};

const tsConfig = `import type { GracefulConfig } from '@grace-studio/graceful-figma';
const config: GracefulConfig = { 'react-svgs': { out: './from-ts' } };
export default config;
`;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadConfig', () => {
  it('loads a TypeScript config without a compiler', async () => {
    projectWith({ 'graceful.config.ts': tsConfig });

    await expect(loadConfig()).resolves.toEqual({
      config: { 'react-svgs': { out: './from-ts' } },
      configPath: 'graceful.config.ts',
    });
  });

  it('prefers a JS config over a TS config', async () => {
    projectWith({
      'graceful.config.ts': tsConfig,
      'graceful.config.mjs': `export default { 'react-svgs': { out: './from-js' } };`,
    });

    const { configPath } = await loadConfig();
    expect(configPath).toBe('graceful.config.mjs');
  });

  it.each([
    [{}, /No config file found/],
    [{ 'graceful.config.mjs': 'export const x = 1;' }, /No default export/],
  ])('rejects with a helpful error for %j', async (files, error) => {
    projectWith(files);

    await expect(loadConfig()).rejects.toThrow(error);
  });
});
