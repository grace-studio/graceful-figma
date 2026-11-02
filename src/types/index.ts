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
  /**
   * Replaces fill and stroke colors with `currentColor`, so the svgs take the CSS `color`.
   * `none` and gradient references are kept.
   * @default true
   */
  shouldUseCurrentColor?: boolean;
};

/** Config of the `svgs` and `react-svgs` commands. */
export type SvgsConfig = {
  /**
   * Array of Figma sources to extract svgs from
   */
  sources: FigmaFetchSource[];
  /**
   * Output dir, cleared before writing. Must be inside the project root.
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

/** Content of `graceful.config.ts`, one key per command. */
export type GracefulConfig = {
  /** Config of the `svgs` command, writing `.svg` files */
  svgs?: Partial<SvgsConfig>;
  /** Config of the `react-svgs` command, writing React components */
  'react-svgs'?: Partial<SvgsConfig>;
};

/** A component that failed processing or was skipped, reported to the user after extraction. */
export type ComponentIssue = Pick<
  SvgComponent,
  | 'figmaComponentName'
  | 'figmaFileName'
  | 'figmaPageName'
  | 'figmaSectionName'
  | 'pageAlias'
> & {
  /** Human readable reason for the issue */
  description: string;
};
