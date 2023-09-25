export type SvgComponent = {
  width?: number;
  height?: number;
  svg: string;
  name: string;
};

export type Component = {
  name: string;
  component: string;
};

export type FigmaFetchOptions = {
  token: string;
  section: string;
  page: string;
  key: string;
};

export type ExtractSvgOptions = {
  key: string;
  page: string;
  section: string;
  out: string;
  token?: string;
};

export type Config = {
  token?: string;
  'react-icons'?: Partial<Omit<ExtractSvgOptions, 'token'>>;
};
