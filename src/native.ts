import * as cheerio from 'cheerio-without-node-native'
import globals from './globals'

// Initialize the cheerio object to be the 'cheerio-without-node-native' module.
// Compare with index.ts
globals.cheerio = cheerio

export * from './api'
