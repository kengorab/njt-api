const stationInfo: { [name: string]: StationInfo } = require('../../data/station-info.json')
const stationScheduleIds: { [name: string]: string } = require('../../data/schedule-ids.json')

const stations = Object.keys(stationInfo)

export function getStationNames(): string[] {
  return stations
}

export function getStations(): { [name: string]: StationInfo } {
  return stationInfo
}

export function getStation(stationName: string): StationInfo | null {
  return stationInfo[stationName]
}

export function getScheduleIdForStation(stationName: string): string | null {
  return stationScheduleIds[stationName]
}
