export type Package = {
  name: string
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

export type Meta = {
  name: string
  description: string
  homepage: string
  package?: Package
}

export type CreateOptions = {
  name?: string
  type?: string
}

export type NextAnswers = {
  template: 'next'
  name: string
  directory: string
  hooks: 'react-query' | 'react-use'
  ui: 'none' | 'tailwind' | 'bootstrap' | 'antd'
}

export type NuxtAnswers = {
  template: 'nuxt'
  name: string
  directory: string
  ui: 'none' | 'tailwind' | 'bootstrap' | 'antd'
}

export type Answers = NextAnswers | NuxtAnswers
