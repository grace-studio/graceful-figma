import dotenv from 'dotenv';
import inquirer, { DistinctQuestion } from 'inquirer';
import { FigmaFetchService } from '../services/FigmaFetchService.js';
import { ComponentFactory } from '../factories/componentFactory.js';
import { FileUtil } from '../utils/FileUtil.js';
import chalk from 'chalk';
import { SvgFactory } from '../factories/svgFactory.js';
import { ReactIconsConfig } from '../types/index.js';
import { toPascalCase } from '../utils/index.js';

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

  const svgs = await Promise.all(options.sources.map(fetchService.extractSvgs));
  const components = await Promise.all(
    svgs
      .flat()
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
  console.log(chalk.yellow.bold(`\nExtracted ${components.length} icons`));
  console.log(chalk.yellow(iconNames));
  console.log(chalk.green.bold('\nSuccess!\n'));
};
