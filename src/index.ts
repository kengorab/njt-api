import * as API from './api'
import 'isomorphic-fetch'

export const Trips = {
  getTripOptions: API.getTripOptions
}

export const Stations = {
  getStationNames: API.getStationNames,
  getStations: API.getStations,
  getStationInfo: API.getStationInfo
}
