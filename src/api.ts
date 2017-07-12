import * as moment from 'moment'
import * as TripManager from './manager/njt-trip-manager'
import * as StationManager from './manager/station-manager'

async function getTripOptions(
  fromStation: string,
  toStation: string,
  when?: Date | string
): Promise<Trip[]> {
  const origin = StationManager.getStation(fromStation)
  if (!origin) {
    throw new Error(`Invalid fromStation: ${fromStation}`)
  }

  const destination = StationManager.getStation(toStation)
  if (!destination) {
    throw new Error(`Invalid toStation: ${toStation}`)
  }

  const tripDate = when ? moment(when) : moment()
  if (!tripDate.isValid()) {
    throw new Error(`Invalid date/time format: ${when}`)
  }

  return await TripManager.getTripOptionsFromNJTPage(origin, destination, tripDate)
}

function getStationNames(): string[] {
  return StationManager.getStationNames()
}

function getStations(): { [name: string]: StationInfo } {
  return StationManager.getStations()
}

function getStationInfo(stationName: string): StationInfo {
  const station = StationManager.getStation(stationName)
  if (!station) {
    throw new Error(`Invalid station name: ${stationName}`)
  }

  return station
}

export const Trips = {
  getTripOptions
}

export const Stations = {
  getStationNames,
  getStations,
  getStationInfo
}
