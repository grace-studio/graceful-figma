import chalk from 'chalk';
import { FigmaFetchOptions, SvgComponent } from '../types/index.js';
import { toPascalCase } from '../utils/index.js';
import { sortByProperty } from '../utils/sortByProperty.js';
import { splitToChunks } from '../utils/splitToChunks.js';

type FigmaNode = {
  id: string;
  name: string;
  type: string;
  section: string;
  children: FigmaNode[];
};

type FigmaResponse = {
  document: FigmaNode;
};

const flattenArray = <T>(acc: T[], curr: T[]) => [...acc, ...curr];

const validateResponse = (data: any) => {
  if (data.status && data.status !== 200) {
    console.error(
      chalk.red('Failed to fetch\n'),
      JSON.stringify(data, null, 2),
      '\n',
    );
    throw new Error();
  }

  return data;
};
export class FigmaFetchService {
  private __figmaFetchOptions: FigmaFetchOptions;
  private __figmaApiUrl: string = 'https://api.figma.com/v1';
  private __fetchOptions: { headers: Record<string, string> } = { headers: {} };
  private __sections: string[];

  private constructor(options: FigmaFetchOptions) {
    this.__figmaFetchOptions = options;
    this.__fetchOptions = {
      headers: {
        'X-Figma-Token': options.token,
      },
    };

    this.__sections = Array.isArray(options.section)
      ? options.section.map((s) => s.toLowerCase())
      : options.section.split(',').map((s) => s.toLowerCase());
  }

  static create(options: FigmaFetchOptions) {
    return new FigmaFetchService(options);
  }

  private _findPageCanvas = (node: FigmaNode): FigmaNode[] => {
    if (
      node.name.toLowerCase() === this.__figmaFetchOptions.page.toLowerCase() &&
      node.type.toLowerCase() === 'canvas'
    ) {
      return [node];
    }

    if ('children' in node) {
      return node.children.map(this._findPageCanvas).reduce(flattenArray, []);
    }

    return [];
  };

  private _findIconSections = (node: FigmaNode): FigmaNode[] => {
    if (
      this.__sections.includes(node.name.toLowerCase()) &&
      node.type.toLowerCase() === 'section'
    ) {
      return [{ ...node, section: node.name.toLowerCase() }];
    }

    if ('children' in node) {
      return node.children.map(this._findIconSections).reduce(flattenArray, []);
    }

    return [];
  };

  private _findComponents = (node: FigmaNode): FigmaNode[] => {
    if (node.type.toLowerCase() === 'component') {
      return [node];
    }

    if ('children' in node) {
      return node.children
        .map((subNode) =>
          this._findComponents({ ...subNode, section: node.section }),
        )
        .reduce(flattenArray, []);
    }

    return [];
  };

  private _getPageId = async () => {
    const { document } = await fetch(
      `${this.__figmaApiUrl}/files/${this.__figmaFetchOptions.key}?depth=1`,
      this.__fetchOptions,
    )
      .then((response) => response.json())
      .then(validateResponse);
    const [node] = this._findPageCanvas(document);

    return node?.id ?? null;
  };

  private _fetchFigmaFile = async (): Promise<FigmaResponse> => {
    const id = await this._getPageId();

    return fetch(
      `${this.__figmaApiUrl}/files/${this.__figmaFetchOptions.key}?ids=${id}`,
      this.__fetchOptions,
    )
      .then((response) => response.json())
      .then(validateResponse);
  };

  private _fetchFigmaImages = (
    ids: string[],
  ): Promise<{ images: Record<string, string> }> =>
    fetch(
      `${this.__figmaApiUrl}/images/${
        this.__figmaFetchOptions.key
      }?ids=${ids.join()}&format=svg`,
      this.__fetchOptions,
    )
      .then((response) => response.json())
      .then(validateResponse);

  private _getSvgsFromComponents = async (
    components: FigmaNode[],
  ): Promise<SvgComponent[]> => {
    const ids = components.map(({ id }) => id);
    const { images } = await this._fetchFigmaImages(ids);
    const svgComponents = components
      .map(({ id, name, section }) => ({
        id,
        name,
        section,
        url: images[id],
      }))
      .filter((comp) => {
        if (comp.url) {
          return true;
        } else {
          console.log(
            chalk.red(
              `Invalid SVG component found.\nName: ${comp.name}\nSection: ${comp.section}\n`,
            ),
          );
          return false;
        }
      });

    const componentChunks = splitToChunks(svgComponents, 20);

    const svgs = [];
    for await (let chunk of componentChunks) {
      const _svgs = await Promise.all(
        chunk.map(({ url, name, section }) =>
          fetch(url)
            .then((response) => response.text())
            .then((data) => ({ svg: data, name: toPascalCase(name), section })),
        ),
      );
      svgs.push(..._svgs);
    }

    return svgs
      .map((component) => ({
        fileName: `${component.section}/${component.name}`,
        ...component,
      }))
      .sort(sortByProperty('fileName', 'asc'));
  };

  public extractSvgs = async () => {
    const { document } = await this._fetchFigmaFile();

    const components = this._findPageCanvas(document)
      .flatMap(this._findIconSections)
      .flatMap(this._findComponents);

    const svgs = await this._getSvgsFromComponents(components);

    return svgs;
  };
}
