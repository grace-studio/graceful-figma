import chalk from 'chalk';
import { SvgComponent } from '../types/index.js';
import { clearAndUpper, toPascalCase } from '../utils/index.js';
import { sortByProperty } from '../utils/sortByProperty.js';

export type FigmaFetchOptions = {
  token: string;
  iconSliceName: string;
  pageName: string;
  projectKey: string;
};

type FigmaNode = {
  id: string;
  name: string;
  type: string;
  children: FigmaNode[];
};

type FigmaResponse = {
  document: FigmaNode;
};

const extractSvgChildren = (svg: string): Omit<SvgComponent, 'name'> => {
  const svgStr = svg.replaceAll('\n', '');
  const width = (svgStr.match(/(?<=width=")\d+(?=")/) || [])[0];
  const height = (svgStr.match(/(?<=height=")\d+(?=")/) || [])[0];
  const children = (svgStr.match(/(?<=<svg.*>).+(?=<\/svg>)/) || [''])[0];

  return {
    width: width ? Number(width) : undefined,
    height: height ? Number(height) : undefined,
    children: children
      .replace(/-[a-z](?=.+=")/gm, clearAndUpper)
      .replace(/fill="#[a-fA-F0-9]{6}"/gm, ''),
  };
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
      node.name.toLowerCase() === this.__figmaFetchOptions.pageName &&
      node.type === 'CANVAS'
    ) {
      return [node];
    }

    if ('children' in node) {
      return node.children.map(this._findPageCanvas).reduce(flattenArray, []);
    }

    return [];
  };

  private _findIconSlices = (node: FigmaNode): FigmaNode[] => {
    if (
      node.name.toLowerCase() === this.__figmaFetchOptions.iconSliceName &&
      node.type === 'SECTION'
    ) {
      return [node];
    }

    if ('children' in node) {
      return node.children.map(this._findIconSlices).reduce(flattenArray, []);
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
      `${this.__figmaApiUrl}/files/${this.__figmaFetchOptions.projectKey}`,
      this.__fetchOptions,
    )
      .then((response) => response.json())
      .then(validateResponse);

  private _fetchFigmaImages = (
    ids: string[],
  ): Promise<{ images: Record<string, string> }> =>
    fetch(
      `${this.__figmaApiUrl}/images/${
        this.__figmaFetchOptions.projectKey
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
          .then(extractSvgChildren)
          .then((data) => ({ ...data, name: toPascalCase(name) })),
      ),
    );

    return svgs.sort(sortByProperty('name', 'asc'));
  };

  public extractSvgs = async () => {
    const { document } = await this._fetchFigmaFile();

    const components = this._findPageCanvas(document)
      .flatMap(this._findIconSlices)
      .flatMap(this._findComponents);

    const svgs = await this._getSvgsFromComponents(components);

    return svgs;
  };
}
