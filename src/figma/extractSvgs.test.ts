import { afterEach, describe, expect, it, vi } from 'vitest';
import { FigmaFetchSource } from '../types/index.js';
import { extractSvgs } from './extractSvgs.js';

const node = (
  type: string,
  name: string,
  children: object[] = [],
  id = name,
) => ({
  id,
  type,
  name,
  children,
});

const fileWith = (arrows: object[]) => ({
  name: 'My File',
  document: node('DOCUMENT', 'doc', [
    node('CANVAS', 'Cover', [], 'page-0'),
    node(
      'CANVAS',
      ' Svgs ',
      [
        node('SECTION', 'Arrows', arrows),
        node('SECTION', 'Ignored', [node('COMPONENT', 'skip me', [], 'c-x')]),
      ],
      'page-1',
    ),
  ]),
});

const defaultFile = fileWith([
  node('COMPONENT', 'arrow right', [], 'c-2'),
  node('FRAME', 'group', [node('COMPONENT', 'arrow left', [], 'c-1')]),
  node('COMPONENT', 'broken', [], 'c-3'),
]);

/** Fakes the Figma file + images endpoints and the rendered SVG URLs. `c-3` never renders. */
const fakeFigma = (file: object) => (url: string) => {
  switch (true) {
    case url.includes('/images/'): {
      const ids = new URL(url).searchParams.get('ids')?.split(',') ?? [];
      const images = ids.map((id) => [id, id === 'c-3' ? null : `svg://${id}`]);

      return Response.json({ images: Object.fromEntries(images) });
    }
    case url.startsWith('svg://'):
      return new Response(`<svg>${url}</svg>`);
    default:
      return Response.json(file);
  }
};

const stubFetch = (
  file: object = defaultFile,
  override?: (url: string) => Response | undefined,
) => {
  const fetchMock = vi.fn(
    async (url: string) => override?.(url) ?? fakeFigma(file)(url),
  );
  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

const source: FigmaFetchSource = {
  fileKey: 'key',
  pageName: 'svgs',
  sectionName: 'arrows, misc',
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('extractSvgs', () => {
  it('collects components from matching sections and reports missing renders', async () => {
    stubFetch();

    const { svgs, errors } = await extractSvgs('token', source);

    expect(
      svgs.map(({ name, section, fileName, pageAlias, svg }) => ({
        name,
        section,
        fileName,
        pageAlias,
        svg,
      })),
    ).toEqual([
      {
        name: 'ArrowLeft',
        section: 'Arrows',
        fileName: 'my-file/svgs/arrows/ArrowLeft',
        pageAlias: 'MyFileSvgs',
        svg: '<svg>svg://c-1</svg>',
      },
      {
        name: 'ArrowRight',
        section: 'Arrows',
        fileName: 'my-file/svgs/arrows/ArrowRight',
        pageAlias: 'MyFileSvgs',
        svg: '<svg>svg://c-2</svg>',
      },
    ]);
    expect(errors).toEqual([
      expect.objectContaining({
        description: 'Failed to fetch component image URL',
        figmaComponentName: 'broken',
      }),
    ]);
  });

  it('renders large sections in batches without losing svgs', async () => {
    const components = Array.from({ length: 120 }, (_, index) =>
      node('COMPONENT', `svg ${index}`, [], `i-${index}`),
    );
    const fetchMock = stubFetch(fileWith(components));

    const { svgs } = await extractSvgs('token', source);

    const imageRequests = fetchMock.mock.calls.filter(([url]) =>
      url.includes('/images/'),
    );
    expect(imageRequests).toHaveLength(3);
    expect(svgs).toHaveLength(120);
  });

  it.each([
    [{ sectionName: ['nope'] }, 'Figma source(s) without valid components'],
    [
      { pageName: 'nope' },
      'Page "nope" not found. Available pages: "Cover", " Svgs "',
    ],
  ])(
    'reports a source with %j instead of failing',
    async (overrides, description) => {
      stubFetch();

      const result = await extractSvgs('token', {
        ...source,
        ...overrides,
        alias: 'Brand',
      });

      expect(result).toEqual({
        svgs: [],
        errors: [expect.objectContaining({ description, pageAlias: 'Brand' })],
      });
    },
  );

  it.each([
    [
      'the Figma API',
      (url: string) =>
        url.includes('/files/')
          ? Response.json(
              { status: 403, err: 'Invalid token' },
              { status: 403, statusText: 'Forbidden' },
            )
          : undefined,
      'Fetching Figma file "key" failed (403 Forbidden): Invalid token',
    ],
    [
      'an SVG download',
      (url: string) =>
        url === 'svg://c-1'
          ? new Response('<Error />', { status: 500 })
          : undefined,
      'Downloading SVG for "arrow left" failed (500)',
    ],
  ])(
    'rejects with a readable message when %s fails',
    async (_, override, message) => {
      stubFetch(defaultFile, override);

      await expect(extractSvgs('token', source)).rejects.toThrow(message);
    },
  );
});
