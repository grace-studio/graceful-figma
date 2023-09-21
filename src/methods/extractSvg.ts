import inquirer, { QuestionCollection } from 'inquirer';

const questions: QuestionCollection = [
  {
    type: 'input',
    name: 'first_name',
    message: "What's your first name",
  },
  {
    type: 'list',
    name: 'theme',
    message: 'What do you want to do?',
    choices: [
      'Order a pizza',
      'Make a reservation',
      new inquirer.Separator(),
      'Ask for opening hours',
      {
        name: 'Contact support',
        disabled: 'Unavailable at this time',
      },
      'Talk to the receptionist',
    ],
  },
];

export const extractSvg = async () => {
  const answers = await inquirer.prompt(questions);

  console.log(JSON.stringify(answers, null, 2));
};
