import chalk from 'chalk';
import { ComponentIssue } from '../types/index.js';
import { formatComponentDetails } from './formatComponentDetails.js';

/**
 * Logs component issues under a colored heading, nothing when there are none.
 *
 * @param issues - Issues to log
 * @param severity - `error` logs in red, `warning` in yellow
 * @param title - Heading for the list
 */
export const logComponentIssues = (
  issues: ComponentIssue[],
  severity: 'error' | 'warning',
  title: string,
) => {
  if (issues.length === 0) return;

  const color = severity === 'error' ? chalk.red : chalk.yellow;

  console.log(
    color.bold(`\n[${severity.toUpperCase()}] ${title} (${issues.length}):`),
  );
  issues.forEach((issue) =>
    console.log(color(`${formatComponentDetails(issue)}\n`)),
  );
};
