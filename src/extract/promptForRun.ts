import inquirer, { DistinctQuestion } from 'inquirer';

/**
 * Asks for a missing Figma token and confirms clearing the output dir.
 *
 * @param options.out - Output dir that will be cleared
 * @param options.token - Known token, skips the token question when set
 * @param options.force - Skips the confirmation when true
 * @returns The token to use, or undefined when the user declined or gave no token
 */
export const promptForRun = async ({
  out,
  token,
  force,
}: {
  out: string;
  token?: string;
  force?: boolean;
}): Promise<string | undefined> => {
  const tokenQuestion: DistinctQuestion = {
    type: 'input',
    name: 'token',
    message: 'Enter Figma access token',
  };

  const confirmQuestion: DistinctQuestion = {
    type: 'confirm',
    name: 'confirm',
    message: `All content in ${out} will be deleted before writing new files. Proceed?`,
  };

  const answers = await inquirer.prompt([
    ...(token ? [] : [tokenQuestion]),
    ...(force ? [] : [confirmQuestion]),
  ]);

  const isConfirmed = force || answers.confirm === true;

  return isConfirmed ? token || answers.token || undefined : undefined;
};
