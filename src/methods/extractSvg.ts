import inquirer, { QuestionCollection } from 'inquirer';
import {
  FigmaFetchOptions,
  FigmaFetchService,
} from '../services/FigmaFetchService.js';
import { ComponentFactory } from '../factories/componentFactory.js';

const questions: QuestionCollection = [
  {
    type: 'input',
    name: 'token',
    message: 'Enter Figma access token',
  },
];

export const extractSvg = async ({
  outDir,
  ...options
}: Omit<FigmaFetchOptions, 'token'> & { outDir: string }) => {
  const { token } = await inquirer.prompt(questions);

  if (!token) {
    return;
  }

  const instance = FigmaFetchService.create({
    token,
    ...options,
    // iconSliceName: 'icons',
    // pageName: 'components',
    // projectKey: 'HgpwQLKWfOf5JZWNZxb3wy',
  });
  const svgs = await instance.extractSvgs();

  const components = svgs.map(ComponentFactory.createIcon);
  const index = ComponentFactory.createIndexFile(components);

  console.log(components);
  console.log(index);
};

// figd_SYmZG4ivsTALjvkKoNWS66k8Rg9xcyD_l2cLxZH9
