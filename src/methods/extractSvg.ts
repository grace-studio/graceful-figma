import 'dotenv/config';
import inquirer, { DistinctQuestion } from 'inquirer';
import { FigmaFetchService } from '../services/FigmaFetchService.js';
import { ComponentFactory } from '../factories/componentFactory.js';
import { FileUtil } from '../utils/FileUtil.js';
import chalk from 'chalk';
import { ExtractSvgOptions } from '../types/index.js';
import { SvgFactory } from '../factories/svgFactory.js';

export const extractSvg = async ({
  out,
  token: _token,
  ...options
}: ExtractSvgOptions) => {
  let token = process.env.FIGMA_ACCESS_TOKEN || _token;
  let questions: DistinctQuestion[] = [];

  if (!token) {
    questions = [
      {
        type: 'input',
        name: 'token',
        message: 'Enter Figma access token',
      },
    ];
  }

  questions = [
    ...questions,
    {
      type: 'confirm',
      name: 'confirm',
      message: `All content in ${out} will be deleted before writing new files. Proceed?`,
    },
  ];

  const answers = await inquirer.prompt(questions);
  token = token || answers.token;

  if (!token || !answers.confirm) {
    return;
  }

  const fetchService = FigmaFetchService.create({
    token,
    ...options,
  });

  const svgs = await fetchService.extractSvgs();
  const components = svgs
    .map(SvgFactory.applyReactAttributeNamingConvention)
    .map(SvgFactory.removeFill)
    .map(SvgFactory.extractSvgChildren)
    .map(ComponentFactory.createIcon);
  const index = ComponentFactory.createIndexFile(components);

  FileUtil.clearPath(out);
  FileUtil.writeFile(out, 'index.tsx', index);
  components.forEach(({ name, component }) =>
    FileUtil.writeFile(`${out}/icons`, `${name}.tsx`, component),
  );

  const iconNames = components.map(({ name }) => ` - ${name}`).join('\n');
  console.log(chalk.green('\nSuccess!'));
  console.log(chalk.yellow('\nExtracted the following icons:'));
  console.log(chalk.yellow(iconNames));
};
