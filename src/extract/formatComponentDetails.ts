import chalk from 'chalk';
import { ComponentIssue } from '../types/index.js';

/**
 * Human readable lines describing a component issue.
 *
 * @param issue - The issue to describe
 * @returns Multi-line text
 */
export const formatComponentDetails = (issue: ComponentIssue) =>
  [
    ` - ${chalk.bold(issue.description)}`,
    `    Component: ${issue.figmaComponentName}`,
    `    From: ${issue.pageAlias}`,
    `    File: ${issue.figmaFileName}`,
    `    Page: ${issue.figmaPageName}`,
    `    Section: [${issue.figmaSectionName}]`,
  ].join('\n');
