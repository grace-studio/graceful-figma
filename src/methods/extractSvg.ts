import dotenv from 'dotenv';
import inquirer, { DistinctQuestion } from 'inquirer';
import { FigmaFetchService } from '../services/FigmaFetchService.js';
import { ComponentFactory } from '../factories/componentFactory.js';
import { FileUtil } from '../utils/FileUtil.js';
import chalk from 'chalk';
import { SvgFactory } from '../factories/svgFactory.js';
import { ReactIconsConfig } from '../types/index.js';
import { toPascalCase } from '../utils/index.js';

const formatComponentDetails = (item: {
  description: string;
  figmaComponentName: string;
  pageAlias: string;
  figmaFileName: string;
  figmaPageName: string;
  figmaSectionName: string;
}) => {
  return [
    ` - ${chalk.bold(item.description)}`,
    `    Component: ${item.figmaComponentName}`,
    `    From: ${item.pageAlias}`,
    `    File: ${item.figmaFileName}`,
    `    Page: ${item.figmaPageName}`,
    `    Section: [${item.figmaSectionName}]`,
  ].join('\n');
};

const logComponentIssues = (
  items: any[],
  severity: 'error' | 'warning',
  title: string,
) => {
  if (items.length === 0) return;

  const colorFn = severity === 'error' ? chalk.red : chalk.yellow;
  const severityText = severity.toUpperCase();

  console.log(colorFn.bold(`\n[${severityText}] ${title} (${items.length}):`));
  items.forEach((item) =>
    console.log(colorFn(formatComponentDetails(item).concat('\n'))),
  );
};

dotenv.config({ path: '.env.local' });
dotenv.config({ override: true });

export const extractSvg = async ({
  out,
  token: _token,
  ...options
}: ReactIconsConfig) => {
  let token = process.env.FIGMA_ACCESS_TOKEN || _token;

  const getToken: DistinctQuestion = {
    type: 'input',
    name: 'token',
    message: 'Enter Figma access token',
  };

  const confirm: DistinctQuestion = {
    type: 'confirm',
    name: 'confirm',
    message: `All content in ${out} will be deleted before writing new files. Proceed?`,
  };

  const questions = [
    ...(token ? [] : [getToken]),
    ...(options.force ? [] : [confirm]),
  ];

  const answers = await inquirer.prompt(questions);
  token = token || answers.token;

  if (!token || (!answers.confirm && !options.force)) {
    return;
  }

  console.log(
    chalk.green.dim(
      `Extracting icons with options:\n${JSON.stringify(options, null, 1)}\n`,
    ),
  );

  const fetchService = FigmaFetchService.create(token);

  const results = await Promise.all(
    options.sources.map(fetchService.extractSvgs),
  );

  // Extract SVGs and errors from results
  const allSvgs = results.flatMap((result) => result.svgs);
  const allErrors = results.flatMap((result) => result.errors);

  // Filter svgs to have unique icons by filepath - only one icon in the collection with each path.
  // Add all duplicates to a separate collection that can be printed at the end.
  const flatSvgs = allSvgs;
  const seenFilePaths = new Set<string>();
  const uniqueSvgs: typeof flatSvgs = [];
  const duplicateSvgs: typeof flatSvgs = [];

  for (const svg of flatSvgs) {
    if (seenFilePaths.has(svg.fileName)) {
      duplicateSvgs.push({
        ...svg,
        description: 'Component has duplicate filename',
      });
    } else {
      seenFilePaths.add(svg.fileName);
      uniqueSvgs.push(svg);
    }
  }

  const components = await Promise.all(
    uniqueSvgs
      .map(SvgFactory.applyReactAttributeNamingConvention)
      .map(SvgFactory.removeFill)
      .map(SvgFactory.extractSvgChildren)
      .map(ComponentFactory.createIcon),
  );

  const componentName = toPascalCase(
    out.replace(/\/$/, '').split('/').slice(-1)[0] || 'icons',
  );

  const index = await ComponentFactory.createIndexFile(
    components,
    componentName,
  );
  const iconByName = await ComponentFactory.createIconByName();

  FileUtil.clearPath(out);
  FileUtil.writeFile(out, 'index.tsx', index);
  FileUtil.writeFile(out, 'IconByName.tsx', iconByName);
  components.forEach(({ name, filePath, component }) =>
    FileUtil.writeFile(`${out}/${filePath}`, `${name}.tsx`, component),
  );

  const iconNames = components
    .map(({ fileName }) => ` - ${fileName}`)
    .join('\n');
  console.log(chalk.cyan.bold(`\nExtracted ${components.length} icons`));

  console.log(chalk.cyan(iconNames));

  logComponentIssues(allErrors, 'error', 'Component processing failures');

  logComponentIssues(duplicateSvgs, 'warning', 'Duplicate icon filenames');

  if (duplicateSvgs.length > 0) {
    console.log(
      chalk.green('\nSuccessfully extracted icons with duplicates.\n'),
    );
  } else {
    console.log(chalk.green.bold('\nSuccessfully extracted all icons!\n'));
  }
};
