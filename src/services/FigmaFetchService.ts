import chalk from 'chalk';
import { FigmaFetchOptions, SvgComponent } from '../types/index.js';
import { clearAndUpper, toPascalCase } from '../utils/index.js';
import { sortByProperty } from '../utils/sortByProperty.js';

type FigmaNode = {
  id: string;
  name: string;
  type: string;
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

  private constructor(options: FigmaFetchOptions) {
    this.__figmaFetchOptions = options;
    this.__fetchOptions = {
      headers: {
        'X-Figma-Token': options.token,
      },
    };
  }

  static create(options: FigmaFetchOptions) {
    return new FigmaFetchService(options);
  }

  private _findPageCanvas = (node: FigmaNode): FigmaNode[] => {
    if (
      node.name.toLowerCase() === this.__figmaFetchOptions.page &&
      node.type === 'CANVAS'
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
      node.name.toLowerCase() === this.__figmaFetchOptions.section &&
      node.type === 'SECTION'
    ) {
      return [node];
    }

    if ('children' in node) {
      return node.children.map(this._findIconSections).reduce(flattenArray, []);
    }

    return [];
  };

  private _findComponents = (node: FigmaNode): FigmaNode[] => {
    if (node.type === 'COMPONENT') {
      return [node];
    }

    if ('children' in node) {
      return node.children.map(this._findComponents).reduce(flattenArray, []);
    }

    return [];
  };

  private _fetchFigmaFile = (): Promise<FigmaResponse> =>
    fetch(
      `${this.__figmaApiUrl}/files/${this.__figmaFetchOptions.key}`,
      this.__fetchOptions,
    )
      .then((response) => response.json())
      .then(validateResponse);

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
    const svgs = await Promise.all(
      components.map(({ id, name }) =>
        fetch(images[id])
          .then((response) => response.text())
          .then((data) => ({ svg: data, name: toPascalCase(name) })),
      ),
    );

    return svgs.sort(sortByProperty('name', 'asc'));
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
