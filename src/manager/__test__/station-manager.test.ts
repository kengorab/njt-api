const stationInfo = require('../../../data/station-info.json')
import * as StationManager from '../station-manager'
import * as  _ from 'lodash'

describe('getStations', () => {
  it('should return StationInfo for all stations', () => {
    expect(StationManager.getStations()).toEqual(stationInfo)
  })
})

describe('getStationNames', () => {
  it('should return all station names', () => {
    expect(StationManager.getStationNames()).toEqual(Object.keys(stationInfo))
  })
})

describe('getStation', () => {
  it('should return undefined if station is invalid', () => {
    _.sampleSize(Object.keys(stationInfo), 10)
      .map(station => station + 'random-crap')
      .forEach(invalidStation =>
        expect(StationManager.getStation(invalidStation)).toBe(undefined)
      )
  })

  it('should return StationInfo for valid station', () => {
    _.sampleSize(Object.keys(stationInfo), 10).forEach(station => {
      expect(StationManager.getStation(station)).toEqual(stationInfo[station])
    })
  })
})
