export type SvgComponent = {
  width?: number;
  height?: number;
  svg: string;
  name: string;
  section: string;
  fileName: string;
};

export type Component = {
  name: string;
  section: string;
  fileName: string;
  component: string;
};

export type FigmaFetchOptions = {
  key: string;
  page: string;
  section: string | string[];
  token: string;
};

export type ExtractSvgOptions = Omit<FigmaFetchOptions, 'token'> & {
  out: string;
  token?: string;
  force?: boolean;
};

export type Config = {
  token?: string;
  'react-icons'?: Partial<Omit<ExtractSvgOptions, 'token'>>;
};
