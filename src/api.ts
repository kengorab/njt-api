import * as moment from 'moment'
import * as TripManager from './manager/njt-trip-manager'
import * as ScheduleManager from './manager/njt-schedule-manager'
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

async function getScheduleForDay(
  originStation: string,
  destStation: string,
  when?: Date | string
): Promise<Schedule> {
  const originId = StationManager.getScheduleIdForStation(originStation)
  if (!originId) {
    throw new Error(`No scheduleId for originStation: ${originStation}`)
  }

  const destinationId = StationManager.getScheduleIdForStation(destStation)
  if (!destinationId) {
    throw new Error(`No scheduleId for destStation: ${destStation}`)
  }

  const tripDate = when ? moment(when) : moment()
  if (!tripDate.isValid()) {
    throw new Error(`Invalid date/time format: ${when}`)
  }

  const results = await ScheduleManager.getScheduleFromNJTPage(
    originStation,
    originId,
    destStation,
    destinationId,
    tripDate
  )

  return { results }
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

export const Schedule = {
  getScheduleForDay
}
