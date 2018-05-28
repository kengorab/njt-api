jest.mock('../manager/njt-trip-manager', () => ({
  getTripOptionsFromNJTPage: jest.fn(() => {
    return Promise.resolve([{ phases: [] }])
  })
}))

const stationInfo = require('../../data/station-info.json')

import * as moment from 'moment'
import * as  _ from 'lodash'
import * as API from '../index'
import * as TripManager from '../manager/njt-trip-manager'

describe('API', () => {
  beforeEach(() => {
    (TripManager.getTripOptionsFromNJTPage as jest.Mock<Promise<Trip[]>>).mockClear()
  })

  describe('Stations', () => {
    describe('getStationInfo', () => {
      it('should throw an error when given invalid station info', () => {
        expect(() => {
          API.Stations.getStationInfo('some garbage station')
        }).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('Trips', () => {
    describe('getTripOptions', () => {
      it('should return a rejected Promise when given invalid "from" station name', async () => {
        const realStationName = _.sample(Object.keys(stationInfo))!!
        const promise = API.Trips.getTripOptions('some garbage "from" station', realStationName)
        await expect(promise).rejects.toMatchSnapshot()
      })

      it('should return a rejected Promise when given invalid "to" station name', async () => {
        const realStationName = _.sample(Object.keys(stationInfo))!!
        const promise = API.Trips.getTripOptions(realStationName, 'some garbage "to" station')
        await expect(promise).rejects.toMatchSnapshot()
      })

      it('should return a rejected Promise when given invalid date (passed as a string)', async () => {
        const [fromStation, toStation] = _.sampleSize(Object.keys(stationInfo), 2)
        const promise = API.Trips.getTripOptions(fromStation, toStation, '19-35-2009')
        await expect(promise).rejects.toMatchSnapshot()
      })

      it('should return a rejected Promise when given invalid date (passed as a string)', async () => {
        const [fromStation, toStation] = _.sampleSize(Object.keys(stationInfo), 2)
        const promise = API.Trips.getTripOptions(fromStation, toStation, '19-35-2009')
        await expect(promise).rejects.toMatchSnapshot()
      })

      it('should return a Promise which resolves to a list of trip options (given valid stations/date)', async () => {
        const [fromStation, toStation] = _.sampleSize(Object.keys(stationInfo), 2)
        const promise = API.Trips.getTripOptions(fromStation, toStation, moment().toDate())
        await expect(promise).resolves.toMatchSnapshot()
      })

      it('should call TripManager for trip options, passing "to" and "from" stations, and date', async () => {
        const [fromStationName, toStationName] = _.sampleSize(Object.keys(stationInfo), 2)
        await API.Trips.getTripOptions(fromStationName, toStationName, moment().toDate())

        expect(TripManager.getTripOptionsFromNJTPage).toHaveBeenCalled()
        const [fromStation, toStation, date] =
          (TripManager.getTripOptionsFromNJTPage as jest.Mock<Promise<Trip[]>>).mock.calls[0]
        expect(fromStation).toEqual(stationInfo[fromStationName])
        expect(toStation).toEqual(stationInfo[toStationName])
        expect(moment().diff(moment(date))).toBeLessThan(1000) // Verify dates are less than 1s apart (close enough)
      })
    })
  })
})
