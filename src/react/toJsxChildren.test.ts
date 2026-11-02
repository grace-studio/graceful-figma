import { describe, expect, it } from 'vitest';
import { SvgComponent } from '../types/index.js';
import { toJsxChildren } from './toJsxChildren.js';

const figmaSvg = `<svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0)">
    <path fill-rule="evenodd" d="M1 1h22" fill="#1E1E1E" data-name="x" aria-hidden="true"/>
    <path d="M2 2" fill="none" stroke="#000" stroke-width="2"/>
  </g>
  <mask id="m" style="mask-type:alpha;-webkit-mask:none"/>
  <use xlink:href="#a"/>
</svg>`;

describe('toJsxChildren', () => {
  it('turns a Figma SVG export into JSX-ready children', () => {
    const { svg, width, height } = toJsxChildren({
      svg: figmaSvg,
    } as SvgComponent);

    expect(width).toBe(24);
    expect(height).toBe(16);
    expect(svg).toBe(
      [
        '<g clipPath="url(#clip0)">',
        '<path fillRule="evenodd" d="M1 1h22" fill="#1E1E1E" data-name="x" aria-hidden="true"/>',
        '<path d="M2 2" fill="none" stroke="#000" strokeWidth="2"/>',
        '</g>',
        '<mask id="m" style={{"maskType":"alpha","WebkitMask":"none"}}/>',
        '<use xlink:href="#a"/>',
      ].join(''),
    );
  });
});
