import { Command } from 'commander'

import type { CreateOptions, TemplateType } from './common/types'
import { PACKAGE_NAME } from './common/constants'
import { fs } from './utils'
import prompts from './prompts'
import tasks from './tasks'

function cancel() {
  fs.remove(PACKAGE_NAME)
}

function create(template: TemplateType, options: CreateOptions) {
  switch (template) {
    case 'next':
      prompts.next(options).then(tasks.next).catch(cancel)
      break
    default:
      console.log('Template not found, please use the templates in the list.')
      break
  }
}

export default function program() {
  const program = new Command('tesla')
  program.version('1.0.0')
  program.usage('<command> [options]')

  program
    .command('create <template>')
    .description('you can use next, node, react and nuxt templates')
    .option('--name <name>', 'specify the name of the project')
    .option('--directory <directory>', 'specify the directory for the project')
    .action(create)

  program
    .command('doctor')
    .description('check if everything is ok on your system')
    .action(() => {
      console.log('doctor')
    })

  program.parse(process.argv)
}
