import { ComponentIssue, SvgComponent } from '../types/index.js';

/** A node in the Figma document tree. */
export type FigmaNode = {
  /** Figma node id, e.g. `1:23` */
  id: string;
  /** Layer name */
  name: string;
  /** Node type, e.g. `CANVAS`, `SECTION`, `COMPONENT` */
  type: string;
  /** Lowercased name of the section the node is in, set while walking the tree */
  section: string;
  /** Child nodes */
  children?: FigmaNode[];
};

/** Response of the Figma files endpoint. */
export type FigmaFile = {
  /** Root node of the file */
  document: FigmaNode;
  /** Figma file name */
  name: string;
};

/** SVGs extracted from one Figma source. */
export type ExtractResult = {
  /** Successfully extracted SVGs */
  svgs: SvgComponent[];
  /** Components or sources that could not be extracted */
  errors: ComponentIssue[];
};
