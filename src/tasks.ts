import { execSync } from 'node:child_process'
import chalk from 'chalk'
import ejs from 'ejs'
import ora from 'ora'

import type {
  Extend,
  MetaData,
  NextAnswers,
  Package,
  TaskParams,
} from './common/types'
import { PACKAGE_NAME, REPOSITORY_URL } from './common/constants'
import { assign, fs } from './utils'

const spinner = ora({
  color: 'cyan',
})

function execute(command: string): void {
  execSync(command, {
    stdio: 'inherit',
  })
}

function path(...dirs: string[]): string {
  return dirs.join('/')
}

class Task {
  private metadata: MetaData[] = []
  private params: TaskParams
  private paths: {
    repository: string
    template: string
    output: string
    boilerplate: string
    plugins: string
  }

  constructor(params: TaskParams) {
    const repository = path(process.cwd(), PACKAGE_NAME)
    const template = path(repository, 'templates', params.template)

    this.params = params
    this.params.plugins = params.plugins.filter((n) => n !== 'none')

    this.paths = {
      repository,
      template,
      output: params.directory,
      boilerplate: path(template, 'boilerplate'),
      plugins: path(template, 'plugins'),
    }
  }

  private download() {
    spinner.text = 'Downloading templates please wait.'

    if (fs.exists(this.paths.repository)) {
      fs.remove(this.paths.repository)
    }

    if (process.env.NODE_ENV === 'production') {
      execute(`git clone ${REPOSITORY_URL}`)
    } else {
      this.paths.output = path('out', this.params.directory)

      if (fs.exists(this.paths.output)) {
        fs.remove(this.paths.output)
      }

      fs.copy(
        'templates',
        `${PACKAGE_NAME}/templates`,
        (name) => !['node_modules', '.next', '.nuxt'].includes(name)
      )
    }
  }

  private meta() {
    spinner.text = 'Resolving metadata files...'

    const { plugins } = this.params

    for (const plugin of plugins) {
      const dir = path(this.paths.plugins, plugin, 'metadata.json')

      try {
        const content = fs.readfile(dir)

        try {
          const data = JSON.parse(content) as MetaData

          this.metadata.push(data)
        } catch {
          spinner.stop()
          console.log(
            chalk.red('error'),
            `The file "${dir}" file is not in the correct format.`
          )
        }
      } catch {
        spinner.stop()
        console.log(chalk.red('error'), `The file "${dir}" could not be found.`)
      }
    }
  }

  private package() {
    spinner.text = 'Combining dependencies...'

    const packages: Package[] = []

    for (const meta of this.metadata) {
      if (meta.package) {
        packages.push(meta.package)
      }
    }

    const dir = path(this.paths.boilerplate, 'package.json')

    try {
      const content = fs.readfile(dir)

      try {
        const data = JSON.parse(content) as Package

        fs.write(dir, JSON.stringify(assign(data, ...packages), null, 2))
      } catch {
        spinner.stop()
        console.log(
          chalk.red('error'),
          `The file "${dir}" file is not in the correct format.`
        )
      }
    } catch {
      spinner.stop()
      console.log(chalk.red('error'), `The file "${dir}" could not be found.`)
    }
  }

  private plugin() {
    spinner.text = 'Copying plugins...'

    const { plugins } = this.params

    for (const plugin of plugins) {
      const dir = path(this.paths.plugins, plugin)

      spinner.text = plugin

      fs.copy(dir, this.paths.boilerplate, (name) => {
        return name !== 'metadata.json'
      })
    }
  }

  private extend() {
    spinner.text = 'Expanding the template...'

    const map: Record<string, Required<Extend>> = {}

    for (const meta of this.metadata) {
      if (meta.extends) {
        for (const extend of meta.extends) {
          if (!map[extend.name]) {
            map[extend.name] = {
              name: extend.name,
              modules: [],
              top: [],
              middle: [],
              bottom: [],
            }
          }

          map[extend.name].modules.push(...extend.modules)

          if (extend.top) {
            map[extend.name].top.push(...extend.top)
          }

          if (extend.middle) {
            map[extend.name].middle.push(...extend.middle)
          }

          if (extend.bottom) {
            map[extend.name].bottom.unshift(...extend.bottom)
          }
        }
      }
    }

    for (const name in map) {
      if (Object.prototype.hasOwnProperty.call(map, name)) {
        const data = map[name]
        const fileDir = path(this.paths.boilerplate, `${name}.ejs`)
        const templateDir = path(this.paths.boilerplate, `${name}.ejs`)
        const template = fs.readfile(templateDir)
        const content = ejs.render(template, data)

        fs.write(fileDir, content)
        fs.remove(templateDir)
      }
    }
  }

  private destructor() {
    spinner.text = 'The project is being created...'

    fs.copy(this.paths.boilerplate, this.paths.output)
    fs.remove(this.paths.repository)

    spinner.stop()
    console.log(
      chalk.green('succes'),
      'The project has been successfully created.'
    )

    execute(`cd ${this.paths.output} && yarn install && yarn lint --fix`)
  }

  begin() {
    spinner.start("We're getting started.")

    this.download()
    this.meta()
    this.package()
    this.plugin()
    this.extend()
    this.destructor()
  }
}

function next(answers: NextAnswers) {
  const transfer = new Task({
    template: 'next',
    name: answers.name,
    directory: answers.directory,
    plugins: [answers.ui, ...answers.hooks],
  })

  transfer.begin()
}

export default {
  next,
}
