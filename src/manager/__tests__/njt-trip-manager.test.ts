jest.mock('../../dao/njt-dao')

import * as NJTTripManager from '../njt-trip-manager'
import * as moment from 'moment'

describe('getTripPhases', () => {
  it('should parse single stage trip from trip string', () => {
    const tripString = `
        Depart :  STATION 1 at 1:23 PM
        Board :  Train 12345 toward STATION 2
        Arrive : STATION 2 at 2:34 PM
    `
    const stages = NJTTripManager.getTripPhases(tripString)
    const expected = [
      {
        departure: { from: 'STATION 1', at: '1:23 PM' },
        board: { trainNumber: '12345', towards: 'STATION 2' },
        arrival: { destination: 'STATION 2', at: '2:34 PM' }
      }
    ]
    expect(stages).toEqual(expected)
  })

  it('should parse multi-stage trip from trip string', () => {
    const tripString = `
        Depart :  STATION 1 at 1:23 PM
        Board :  Train 12345 toward STATION 2
        Arrive : STATION 2 at 2:34 PM
        
        Depart :  STATION 2 at 3:45 PM
        Board :  Train 67890 toward STATION 3
        Arrive : STATION 3 at 4:56 PM
    `
    const stages = NJTTripManager.getTripPhases(tripString)
    const expected = [
      {
        departure: { from: 'STATION 1', at: '1:23 PM' },
        board: { trainNumber: '12345', towards: 'STATION 2' },
        arrival: { destination: 'STATION 2', at: '2:34 PM' }
      },
      {
        departure: { from: 'STATION 2', at: '3:45 PM' },
        board: { trainNumber: '67890', towards: 'STATION 3' },
        arrival: { destination: 'STATION 3', at: '4:56 PM' }
      }
    ]
    expect(stages).toEqual(expected)
  })
})

describe('getTripPhasesFromNJTPage', () => {
  it('should parse njt html and return trip stages from (mocked-out) page', async () => {
    const origin = {
      name: 'IT DOES NOT MATTER',
      lat: 123,
      long: -456,
      departureVisionEnabled: false,
      departureVisionId: ''
    }
    const destination = {
      name: 'THIS IS MOCKED ANYWAY',
      lat: -123,
      long: 456,
      departureVisionEnabled: false,
      departureVisionId: ''
    }
    const date = moment()
    const tripOptions = await NJTTripManager.getTripOptionsFromNJTPage(origin, destination, date)

    const expectedOptions = [
      {
        phases: [
          {
            departure: { from: 'MILLBURN', at: '7:51 AM' },
            board: { trainNumber: '6616', towards: 'NEW YORK PENN STATION' },
            arrival: { destination: 'NEW YORK PENN STATION', at: '8:26 AM' }
          }
        ]
      },
      {
        phases: [
          {
            departure: { from: 'MILLBURN', at: '8:05 AM' },
            board: { trainNumber: '872', towards: 'HOBOKEN' },
            arrival: { destination: 'NEWARK BROAD ST', at: '8:18 AM' }
          },
          {
            departure: { from: 'NEWARK BROAD ST', at: '8:37 AM' },
            board: { trainNumber: '6214', towards: 'NEW YORK PENN STATION' },
            arrival: { destination: 'NEW YORK PENN STATION', at: '8:59 AM' }
          }
        ]
      },
      {
        phases: [
          {
            departure: { from: 'MILLBURN', at: '8:29 AM' },
            board: { trainNumber: '6320', towards: 'NEW YORK PENN STATION' },
            arrival: { destination: 'NEW YORK PENN STATION', at: '9:12 AM' }
          }
        ]
      }
    ]

    expect(tripOptions).toEqual(expectedOptions)
  })
})
