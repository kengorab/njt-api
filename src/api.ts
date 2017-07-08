import * as moment from 'moment'
import * as TripManager from './manager/njt-trip-manager'
import * as StationManager from './manager/station-manager'

export async function getTripOptions(
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

export function getStationNames(): string[] {
  return StationManager.getStationNames()
}

export function getStations(): { [name: string]: StationInfo } {
  return StationManager.getStations()
}

export function getStationInfo(stationName: string): StationInfo {
  const station = StationManager.getStation(stationName)
  if (!station) {
    throw new Error(`Invalid station name: ${stationName}`)
  }

  return station
}
