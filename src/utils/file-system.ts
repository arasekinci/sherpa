import fs from 'node:fs'

export function stat(path: string) {
  const type = fs.statSync(path)

  return {
    file: type.isFile(),
    directory: type.isDirectory(),
  }
}

export function rename(oldPath: string, newPath: string) {
  fs.renameSync(oldPath, newPath)
}

export function write(path: string, data: string) {
  fs.writeFileSync(path, data)
}

export function exists(path: string): boolean {
  return fs.existsSync(path)
}

export function readfile(path: string): string {
  return fs.readFileSync(path, 'utf8')
}

export function mkdir(path: string) {
  fs.mkdirSync(path, { recursive: true })
}

export function copy(
  source: string,
  dest: string,
  condition?: (name: string) => boolean
) {
  const files = fs.readdirSync(source)

  if (!exists(dest)) {
    mkdir(dest)
  }

  for (const file of files) {
    const currentSource = `${source}/${file}`
    const currentDest = `${dest}/${file}`

    if (condition && condition(file) === false) {
      continue
    }

    if (fs.statSync(currentSource).isDirectory()) {
      copy(currentSource, currentDest, condition)
    } else {
      fs.copyFile(`${source}/${file}`, `${dest}/${file}`, (err) => {
        if (err) {
          console.log(`error: could not move ${file} file`)
        }
      })
    }
  }
}

export function remove(path: string) {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true })
  }
}
