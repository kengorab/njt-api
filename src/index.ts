import 'isomorphic-fetch'
import * as cheerio from 'cheerio'
import globals from './globals'

// Initialize the cheerio object to be the normal 'cheerio' module.
// Compare with native.ts
globals.cheerio = cheerio

export * from './api'
