export default [
  {
    type: 'select',
    name: 'template',
    message: 'Choose a project template',
    choices: [
      {
        name: 'next',
        message: 'Next',
        hint: 'This option has a description',
      },
      {
        name: 'nuxt',
        message: 'Nuxt',
        hint: 'This option has a description',
      },
    ],
  },
  {
    type: 'input',
    name: 'name',
    message: 'What would you like to name your project?',
  },
  {
    type: 'select',
    name: 'ui',
    message: 'Choose a UI Library',
    choices: [
      {
        name: 'tailwind',
        message: 'Tailwind',
        hint: 'This option has a description',
      },
      {
        name: 'bootstrap',
        message: 'Bootstrap',
        hint: 'This option has a description',
      },
      {
        name: 'material-design',
        message: 'Material Design',
        hint: 'This option has a description',
      },
      {
        name: 'atlassian-design',
        message: 'Atlassian Design',
        hint: 'This option has a description',
      },
      {
        name: 'and-design',
        message: 'And Design',
        hint: 'This option has a description',
      },
      {
        name: 'next-ui',
        message: 'Next UI',
        hint: 'This option has a description',
      },
    ],
  },
  {
    type: 'multiselect',
    name: 'hooks',
    message: 'Choose a hooks',
    muliple: true,
    hint: 'use <arrow-keys> to navigate, <space> to select.',
    choices: [
      {
        name: 'react-query',
        message: 'React Query',
        hint: 'This option has a description',
      },
      {
        name: 'react-use',
        message: 'React Use',
        hint: 'This option has a description',
      },
    ],
  },
]
