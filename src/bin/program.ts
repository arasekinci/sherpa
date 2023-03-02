import path from 'node:path'
// import { execSync } from 'node:child_process'
import { Command } from 'commander'
import { prompt } from 'enquirer'
// import chalk from 'chalk'
import ejs from 'ejs'
import ora from 'ora'

import type {
  Answers,
  CreateOptions,
  Meta,
  NextAnswers,
  Package,
} from '../common/types'
import { next } from '../questions'
import { assign, fs } from '../utils'

const spinner = ora()

abstract class Transfer<T extends Answers> {
  answers: T
  paths: {
    root: string
    boilerplate: string
    plugins: string
  }

  constructor(answers: T) {
    const root = path.join(process.cwd(), `tesla/templates/${answers.template}`)

    this.answers = answers
    this.paths = {
      root,
      boilerplate: path.join(root, 'boilerplate'),
      plugins: path.join(root, 'plugins'),
    }
  }

  private readmeta(name: string): Meta {
    const metadir = path.join(this.paths.plugins, name, 'meta.json')

    return JSON.parse(fs.readfile(metadir))
  }

  private template(filepath: string, data: Record<string, unknown>) {
    console.log(data)
    const file = filepath + '.ejs'
    const template = ejs.render(fs.readfile(file), data)

    fs.write(file, template)
  }

  plugins(plugins: string[]) {
    for (const plugin of plugins) {
      const dir = path.join(this.paths.plugins, plugin)

      fs.copy(dir, this.paths.boilerplate, (name) => {
        return name !== 'meta.json'
      })
    }
  }

  package(plugins: string[]) {
    const pgkdir = path.join(this.paths.boilerplate, 'package.json')
    const pgk = JSON.parse(fs.readfile(pgkdir))
    const schema: Package[] = []

    for (const plugin of plugins) {
      const meta = this.readmeta(plugin)

      if (meta.package) {
        schema.push(meta.package)
      }
    }

    fs.write(pgkdir, JSON.stringify(assign(pgk, ...schema), null, 2))
  }

  copy() {
    fs.copy(this.paths.boilerplate, `out/${this.answers.directory}`)
    fs.remove('tesla')
  }
}

class NextTransfer extends Transfer<NextAnswers> {
  constructor(answers: NextAnswers) {
    super(answers)
  }

  start() {
    const plugins = [...this.answers.hooks]

    this.package(plugins)
    this.plugins(plugins)
    this.copy()
  }
}

function create(directory: string, options: CreateOptions) {
  console.log('options', options)

  if (process.env.NODE_ENV === 'development') {
    spinner.start()
    spinner.color = 'blue'
    spinner.text = 'Cleaning the development environment'

    const cwd = process.cwd()
    const out = path.join(cwd, 'out')
    const repo = path.join(cwd, 'tesla')

    fs.remove(out)
    fs.mkdir(out)
    fs.remove(repo)
    fs.copy('templates', 'tesla/templates', (name) => {
      const hidden = ['node_modules', '.next', '.nuxt']

      return !hidden.includes(name)
    })

    spinner.stop()
  }

  prompt<Answers>(next).then((answers) => {
    if (answers.template === 'next') {
      const next = new NextTransfer({ ...answers, directory })
      next.start()
    }
  })
}

export default function program() {
  const program = new Command('tesla')
  program.version('1.0.0')
  program.usage('<command> [options]')

  program
    .command('create <project-directory>')
    .description('create a new project powered by tesla')
    .option('-n, --name <name>', 'specifies the name of the project')
    .option('-t, --type <type>', 'specifies the type of project')
    .action(create)

  program
    .command('doctor')
    .description('check if everything is ok on your system')
    .action(() => {
      console.log('doctor')
    })

  program.parse(process.argv)
}
