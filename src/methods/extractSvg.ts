import 'dotenv/config';
import inquirer, { DistinctQuestion } from 'inquirer';
import {
  FigmaFetchOptions,
  FigmaFetchService,
} from '../services/FigmaFetchService.js';
import { ComponentFactory } from '../factories/componentFactory.js';
import { FileUtil } from '../utils/FileUtil.js';
import chalk from 'chalk';

export const extractSvg = async ({
  outDir,
  ...options
}: Omit<FigmaFetchOptions, 'token'> & { outDir: string }) => {
  let token = process.env.FIGMA_ACCESS_TOKEN;
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
      message: `All content in ${outDir} will be deleted before writing new files. Proceed?`,
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
  const components = svgs.map(ComponentFactory.createIcon);
  const index = ComponentFactory.createIndexFile(components);

  FileUtil.clearPath(outDir);
  FileUtil.writeFile(outDir, 'index.tsx', index);
  components.forEach(({ name, component }) =>
    FileUtil.writeFile(`${outDir}/icons`, `${name}.tsx`, component),
  );

  const iconNames = components.map(({ name }) => ` - ${name}`).join('\n');
  console.log(chalk.green('\nSuccess!'));
  console.log(chalk.yellow('\nExtracted the following icons:'));
  console.log(chalk.yellow(iconNames));
};
