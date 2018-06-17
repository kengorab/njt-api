import { StationInfo } from '../types'

type StationInfoMap = {
  [stationName: string]: StationInfo
}
const stationInfo: StationInfoMap = require('../../data/station-info.json')

type StationScheduleIds = {
  [stationId: string]: string
}
const stationScheduleIds: StationScheduleIds = require('../../data/schedule-ids.json')

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

export function getScheduleIds(): string[] {
  return Object.keys(stationScheduleIds)
}

export function getScheduleIdForStation(stationName: string): string | null {
  return stationScheduleIds[stationName]
}
