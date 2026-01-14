export type SvgComponent = {
  width?: number;
  height?: number;
  svg: string;
  name: string;
  description?: string;
  figmaComponentName: string;
  figmaPageName: string;
  figmaFileName: string;
  figmaSectionName: string;
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
  /**
   * Optional alias to use instead of the Figma page name in generated output
   */
  alias?: string;
  /**
   * Figma file ID from the URL (e.g., 'jRRVx4JCzABrXZMsUmeL6z')
   */
  fileKey: string;
  /**
   * Name of the specific page within the Figma file
   */
  pageName: string;
  /**
   * Name(s) of section(s) within the page to extract components from
   */
  sectionName: string | string[];
};

export type FigmaFetchOptions = FigmaFetchSource & {
  token: string;
};

export type ReactIconsConfig = {
  /**
   * Array of Figma sources to extract icons from
   */
  sources: FigmaFetchSource[];
  /**
   * Output directory path where generated icon components will be saved
   */
  out: string;
  /**
   * Figma access token for API authentication (can be set via environment variable)
   */
  token?: string;
  /**
   * Skip confirmation prompts and force execution
   */
  force?: boolean;
};

export type GracefulConfig = {
  'react-icons'?: Partial<ReactIconsConfig>;
};
