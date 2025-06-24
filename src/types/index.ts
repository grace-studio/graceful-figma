export type SvgComponent = {
  width?: number;
  height?: number;
  svg: string;
  name: string;
  section: string;
  pageAlias: string;
  fileName: string;
  filePath: string;
};

export type Component = {
  name: string;
  section: string;
  fileName: string;
  filePath: string;
  pageAlias: string;
  component: string;
};

export type FigmaFetchSource = {
  alias?: string;
  fileKey: string;
  pageName: string;
  sectionName: string | string[];
};

export type FigmaFetchOptions = FigmaFetchSource & {
  token: string;
};

export type ReactIconsConfig = {
  sources: FigmaFetchSource[];
  out: string;
  token?: string;
  force?: boolean;
};

export type Config = {
  'react-icons'?: Partial<ReactIconsConfig>;
};
