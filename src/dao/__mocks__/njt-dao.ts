import * as fs from 'fs'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile)

export const getNJTPageText = async () => {
  const resultsPagePath = `${__dirname}/njt-results-page.html`
  return await readFileAsync(resultsPagePath, 'utf8')
}
