import { describe, expect, it } from 'vitest';
import { createSvgComponent } from './createSvgComponent.js';

describe('createSvgComponent', () => {
  it('creates a typed svg component sized from the Figma export', async () => {
    const { component } = await createSvgComponent({
      name: 'ArrowLeft',
      figmaComponentName: 'arrow "left"',
      filePath: 'file/page/arrows',
      width: 24,
      height: 16,
      svg: '<path d="M1 1h22" />',
      figmaPageName: 'page',
      figmaFileName: 'file',
      figmaSectionName: 'arrows',
      section: 'Arrows',
      pageAlias: 'Graceful',
      fileName: 'file/page/arrows/ArrowLeft',
    });

    expect(component).toContain('const ArrowLeft = ({');
    expect(component).toContain(
      // Escaped so the TSX parses, prettier then picks the quotes that need no escaping.
      `data-svg-name='file/page/arrows/arrow "left"'`,
    );
    expect(component).toContain('viewBox="0 0 24 16"');
    expect(component).toContain('<path d="M1 1h22" />');
    expect(component).toContain('export default ArrowLeft;');
  });
});
