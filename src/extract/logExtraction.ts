import chalk from 'chalk';
import { ComponentIssue } from '../types/index.js';
import { logComponentIssues } from './logComponentIssues.js';

/**
 * Logs the written files, then any failures and duplicates.
 *
 * @param result.fileNames - Written files, relative to the output dir
 * @param result.errors - Components that could not be extracted
 * @param result.duplicates - Components skipped for a duplicate file name
 */
export const logExtraction = ({
  fileNames,
  errors,
  duplicates,
}: {
  fileNames: string[];
  errors: ComponentIssue[];
  duplicates: ComponentIssue[];
}) => {
  console.log(chalk.cyan.bold(`\nExtracted ${fileNames.length} svgs`));
  console.log(
    chalk.cyan(fileNames.map((fileName) => ` - ${fileName}`).join('\n')),
  );

  logComponentIssues(errors, 'error', 'Component processing failures');
  logComponentIssues(duplicates, 'warning', 'Duplicate svg filenames');

  if (errors.length > 0 || duplicates.length > 0) {
    console.log(chalk.yellow('\nExtracted svgs with issues, see above.\n'));
  } else {
    console.log(chalk.green.bold('\nSuccessfully extracted all svgs!\n'));
  }
};
