import chalk from 'chalk';
import { FigmaFetchSource, SvgComponent } from '../types/index.js';
import { toKebabCase, toPascalCase } from '../utils/index.js';
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
  figmaFileName: string;
};

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
  // private __figmaFetchOptions: FigmaFetchOptions;
  private __figmaApiUrl: string = 'https://api.figma.com/v1';
  private __fetchOptions: { headers: Record<string, string> } = { headers: {} };
  // private __sections: string[];

  private constructor(token: string) {
    // this.__figmaFetchOptions = options;
    this.__fetchOptions = {
      headers: {
        'X-Figma-Token': token,
      },
    };
  }

  static create(token: string) {
    return new FigmaFetchService(token);
  }

  private _findPageCanvas =
    (source: FigmaFetchSource) =>
    (node: FigmaNode): FigmaNode[] => {
      if (
        node.name.trim().toLowerCase() ===
          source.pageName.trim().toLowerCase() &&
        node.type.toLowerCase() === 'canvas'
      ) {
        return [node];
      }

      if ('children' in node) {
        return node.children.flatMap(this._findPageCanvas(source));
      }

      return [];
    };

  private _findIconSections =
    (source: FigmaFetchSource) =>
    (node: FigmaNode): FigmaNode[] => {
      const sections = Array.isArray(source.sectionName)
        ? source.sectionName.map((s) => s.trim().toLowerCase())
        : source.sectionName.split(',').map((s) => s.trim().toLowerCase());

      if (
        sections.includes(node.name.trim().toLowerCase()) &&
        node.type.toLowerCase() === 'section'
      ) {
        return [{ ...node, section: node.name.toLowerCase() }];
      }

      if ('children' in node) {
        return node.children.flatMap(this._findIconSections(source));
      }

      return [];
    };

  private _findComponents = (node: FigmaNode): FigmaNode[] => {
    if (node.type.toLowerCase() === 'component') {
      return [node];
    }

    if ('children' in node) {
      return node.children.flatMap((subNode) =>
        this._findComponents({ ...subNode, section: node.section }),
      );
    }

    return [];
  };

  private _getFile = async (source: FigmaFetchSource) => {
    return await fetch(
      `${this.__figmaApiUrl}/files/${source.fileKey}?depth=1`,
      this.__fetchOptions,
    )
      .then((response) => response.json())
      .then(validateResponse);
  };

  private _fetchFigmaPage = async (
    source: FigmaFetchSource,
  ): Promise<FigmaResponse> => {
    const { document, name: figmaFileName } = await this._getFile(source);
    const [node] = this._findPageCanvas(source)(document);
    const pageId = node?.id ?? null;

    const page = await fetch(
      `${this.__figmaApiUrl}/files/${source.fileKey}?ids=${pageId}`,
      this.__fetchOptions,
    )
      .then((response) => response.json())
      .then(validateResponse);

    return { ...page, figmaFileName };
  };

  private _fetchFigmaImages =
    (source: FigmaFetchSource) =>
    (ids: string[]): Promise<{ images: Record<string, string> }> =>
      fetch(
        `${this.__figmaApiUrl}/images/${source.fileKey}?ids=${ids.join()}&format=svg`,
        this.__fetchOptions,
      )
        .then((response) => response.json())
        .then(validateResponse);

  private _getSvgsFromComponents =
    (source: FigmaFetchSource, figmaFileName: string) =>
    async (
      components: FigmaNode[],
    ): Promise<{ svgs: SvgComponent[]; errors: any[] }> => {
      const pageAlias = toPascalCase(
        source.alias ??
          `${toKebabCase(figmaFileName)} ${toKebabCase(source.pageName)}`,
      );

      const ids = components.map(({ id }) => id);
      const { images } = await this._fetchFigmaImages(source)(ids);

      const errors: any[] = [];
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
            errors.push({
              figmaComponentName: comp.name,
              figmaFileName,
              figmaPageName: source.pageName,
              figmaSectionName: comp.section,
              pageAlias,
            });
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
              .then((data) => ({
                svg: data,
                figmaComponentName: name,
                name: toPascalCase(name),
                section,
              })),
          ),
        );
        svgs.push(..._svgs);
      }

      const processedSvgs: SvgComponent[] = svgs
        .map((component) => ({
          ...component,
          figmaPageName: source.pageName,
          figmaFileName,
          figmaSectionName: component.section,
          section: toPascalCase(component.section),
          fileName: `${toKebabCase(figmaFileName)}/${toKebabCase(source.pageName)}/${toKebabCase(component.section)}/${component.name}`,
          filePath: `${toKebabCase(figmaFileName)}/${toKebabCase(source.pageName)}/${toKebabCase(component.section)}`,
          pageAlias,
        }))
        .sort(sortByProperty('fileName', 'asc'));

      return { svgs: processedSvgs, errors };
    };

  public extractSvgs = async (source: FigmaFetchSource) => {
    const { document, figmaFileName } = await this._fetchFigmaPage(source);

    const components = this._findPageCanvas(source)(document)
      .flatMap(this._findIconSections(source))
      .flatMap(this._findComponents);

    return this._getSvgsFromComponents(source, figmaFileName)(components);
  };
}
