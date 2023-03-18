#!/usr/bin/env node
import env from './env'
import program from './program'

const currentNodeVersion = process.versions.node
const semver = currentNodeVersion.split('.')
const major = semver[0]

if (parseInt(major) < 14) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Tesla requires Node 14 or higher. \n' +
      'Please update your version of Node.'
  )

  process.exit(1)
}

env()
program()
