import * as cheerio from 'cheerio'

export default {
  get cheerio() {
    return cheerio
  },
  set cheerio(c: CheerioAPI) {
    console.warn('Setting cheerio in the mock does nothing')
  }
}
