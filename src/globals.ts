const _globals: { cheerio: CheerioAPI | null } = {
  cheerio: null
}

export default {
  get cheerio() {
    if (_globals.cheerio === null) {
      throw new Error('Global cheerio instance has somehow not been initialized')
    }

    return _globals.cheerio
  },
  set cheerio(c: CheerioAPI) {
    _globals.cheerio = c
  }
}
