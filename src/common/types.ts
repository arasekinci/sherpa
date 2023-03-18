export type Extend = {
  name: string
  modules: string[]
  top?: string[]
  middle?: string[]
  bottom?: string[]
}

export type Package = {
  name: string
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

export type MetaData = {
  name: string
  description: string
  website: string
  repository: string
  extends?: Extend[]
  package?: Package
}

export type TemplateType = 'next'

export type TaskParams = {
  template: TemplateType
  name: string
  directory: string
  plugins: string[]
}

export type CreateOptions = {
  name?: string
  directory?: string
}

export type NextAnswers = {
  directory: string
  hooks: 'react-query' | 'react-use'
  name: string
  ui: 'none' | 'tailwind' | 'bootstrap' | 'antd'
}

export type NuxtAnswers = {
  name: string
  directory: string
  ui: 'none' | 'tailwind' | 'bootstrap' | 'antd'
}
