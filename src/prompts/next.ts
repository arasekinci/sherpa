import { prompt } from 'enquirer'

import type { CreateOptions, NextAnswers } from '../common/types'
import * as validations from '../common/validations'

export function next(options: CreateOptions) {
  const { name = 'next-app', directory } = options

  return prompt<NextAnswers>([
    {
      type: 'input',
      name: 'name',
      message: 'What would you like to name your project?',
      initial: name,
      validate: validations.name,
    },
    {
      type: 'input',
      name: 'directory',
      message: 'Which directory should we create your project in?',
      validate: validations.name,
      initial: ({ enquirer }: any) => {
        return directory || enquirer.answers.name
      },
    },
    {
      type: 'select',
      name: 'ui',
      message: 'Choose a UI Library',
      choices: [
        { name: 'none', message: 'None' },
        { name: 'antd', message: 'Ant Design' },
        { name: 'bootstrap', message: 'Bootstrap' },
        { name: 'mui', message: 'Material UI' },
        { name: 'tailwind-css', message: 'Tailwind CSS' },
      ],
    },
    {
      type: 'multiselect',
      name: 'hooks',
      message: 'Choose a hooks',
      hint: 'use <arrow-keys> to navigate, <space> to select.',
      muliple: true,
      choices: [
        { name: 'react-query', message: 'React Query' },
        { name: 'react-use', message: 'React Use' },
      ],
    },
  ])
}
