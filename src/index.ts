import 'isomorphic-fetch'
import * as cheerio from 'cheerio-without-node-native'
import globals from './globals'

// Initialize the cheerio object to be the normal 'cheerio' module.
// Compare with native.ts
globals.cheerio = cheerio

export * from './api'

//export const Trips = {
//  getTripOptions: API.getTripOptions
//}
//
//export const Stations = {
//  getStationNames: API.getStationNames,
//  getStations: API.getStations,
//  getStationInfo: API.getStationInfo
//}
