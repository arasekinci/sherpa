export const name = (value: string) => {
  if (value.length < 2) {
    return 'Project name must be greater than 2 characters.'
  }

  return true
}
