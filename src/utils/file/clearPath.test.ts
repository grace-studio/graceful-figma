import { describe, expect, it } from 'vitest';
import { clearPath } from './clearPath.js';

describe('clearPath', () => {
  it('refuses to delete the project root', () => {
    expect(() => clearPath('.')).toThrow(/Refusing to delete "\."/);
  });
});
