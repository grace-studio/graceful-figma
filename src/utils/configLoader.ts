import path from 'path';
import { GracefulConfig } from '../types/index.js';

export async function loadConfig(): Promise<{ config: GracefulConfig; configPath: string }> {
  let configModule;
  let loadedConfigPath: string;

  // First try JavaScript/ESM files that can be directly imported
  const jsConfigFiles = ['graceful.config.js', 'graceful.config.mjs'];

  for (const configFile of jsConfigFiles) {
    try {
      const configPath = path.resolve(process.cwd(), configFile);
      configModule = await import(configPath);
      loadedConfigPath = configFile;

      const config = configModule.default;
      if (!config) {
        throw new Error(`No default export found in ${configFile}`);
      }

      return { config, configPath: loadedConfigPath };
    } catch (error) {
      // Continue to next file
      continue;
    }
  }

  // If no JS config found, try to handle TypeScript config
  const tsConfigPath = path.resolve(process.cwd(), 'graceful.config.ts');
  try {
    // Check if the TypeScript config file exists
    const fs = await import('fs');
    await fs.promises.access(tsConfigPath);

    // Try to compile and load the TypeScript config
    let typescript;
    try {
      typescript = await import('typescript');
    } catch (error) {
      throw new Error(
        'TypeScript is required to use .ts config files. Please install TypeScript:\n' +
        '  npm install -D typescript\n' +
        'Or use a JavaScript config file instead: graceful.config.js'
      );
    }

    const { transpileModule, ModuleKind, ScriptTarget } = typescript;
    const tsContent = await fs.promises.readFile(tsConfigPath, 'utf8');

    const result = transpileModule(tsContent, {
      compilerOptions: {
        module: ModuleKind.ESNext,
        target: ScriptTarget.ES2020,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    });

    // Write compiled JS to temp file and import it
    const tempConfigPath = path.resolve(process.cwd(), '.graceful.config.tmp.mjs');
    await fs.promises.writeFile(tempConfigPath, result.outputText);

    try {
      configModule = await import(tempConfigPath);
      const config = configModule.default;

      if (!config) {
        throw new Error('No default export found in graceful.config.ts');
      }

      return { config, configPath: 'graceful.config.ts' };
    } finally {
      // Clean up temp file
      try {
        await fs.promises.unlink(tempConfigPath);
      } catch {}
    }
  } catch (error) {
    // TypeScript compilation failed or file not found
    throw new Error(
      'No valid config file found. Please ensure one of these files exists in your project root:\n' +
      '  - graceful.config.js\n' +
      '  - graceful.config.mjs\n' +
      '  - graceful.config.ts'
    );
  }
}