jest.mock('../../dao/njt-dao')
jest.mock('../../globals')

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
        arrival: { destination: 'STATION 2', at: '2:34 PM' },
        duration: 71
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
        arrival: { destination: 'STATION 2', at: '2:34 PM' },
        duration: 71
      },
      {
        departure: { from: 'STATION 2', at: '3:45 PM' },
        board: { trainNumber: '67890', towards: 'STATION 3' },
        arrival: { destination: 'STATION 3', at: '4:56 PM' },
        duration: 71
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
            arrival: { destination: 'NEW YORK PENN STATION', at: '8:26 AM' },
            duration: 35
          }
        ],
        transferDurations: []
      },
      {
        phases: [
          {
            departure: { from: 'MILLBURN', at: '8:05 AM' },
            board: { trainNumber: '872', towards: 'HOBOKEN' },
            arrival: { destination: 'NEWARK BROAD ST', at: '8:18 AM' },
            duration: 13
          },
          {
            departure: { from: 'NEWARK BROAD ST', at: '8:37 AM' },
            board: { trainNumber: '6214', towards: 'NEW YORK PENN STATION' },
            arrival: { destination: 'NEW YORK PENN STATION', at: '8:59 AM' },
            duration: 22
          }
        ],
        transferDurations: [19]
      },
      {
        phases: [
          {
            departure: { from: 'MILLBURN', at: '8:29 AM' },
            board: { trainNumber: '6320', towards: 'NEW YORK PENN STATION' },
            arrival: { destination: 'NEW YORK PENN STATION', at: '9:12 AM' },
            duration: 43
          }
        ],
        transferDurations: []
      }
    ]

    expect(tripOptions).toEqual(expectedOptions)
  })
})

describe('getDuration', () => {
  describe('for 12hr varying time formats', () => {
    [
      ['11:45 AM', '12:00 PM'],
      ['11:45AM', '12:00PM'],
      ['11:45 A', '12:00 P'],
      ['11:45A', '12:00P'],
      ['11:45', '12:00'],
      ['11:45 am', '12:00 pm'],
      ['11:45am', '12:00pm'],
      ['11:45a', '12:00p']
    ].forEach(([startTime, endTime]) => {
      it(`should return 15 for the number of minutes between ${startTime} and ${endTime}`, () => {
        const duration = NJTTripManager.getDuration(startTime, endTime)
        expect(duration).toBe(15)
      })
    })
  })

  it('should return 15 for the number of minutes between 12:45 and 13:00 (testing handling 24hr time format)', () => {
    const duration = NJTTripManager.getDuration('12:45', '13:00')
    expect(duration).toBe(15)
  })

  it('should calculate time differences across am/pm boundaries', () => {
    const duration = NJTTripManager.getDuration('11:45pm', '12:30am')
    expect(duration).toBe(45)
  })
})

describe('getTransferDurations', () => {
  const phase1 = {
    departure: { from: 'STATION 1', at: '1:23 PM' },
    board: { trainNumber: '12345', towards: 'STATION 2' },
    arrival: { destination: 'STATION 2', at: '2:34 PM' },
    duration: 71
  }

  const phase2 = {
    departure: { from: 'STATION 2', at: '3:45 PM' },
    board: { trainNumber: '56789', towards: 'STATION 3' },
    arrival: { destination: 'STATION 3', at: '5:56 PM' },
    duration: 71
  }

  const phase3 = {
    departure: { from: 'STATION 3', at: '6:54 PM' },
    board: { trainNumber: '123', towards: 'STATION 4' },
    arrival: { destination: 'STATION 4', at: '7:54 PM' },
    duration: 60
  }

  it('should return an empty array for a zero-phase trip (this should never happen)', () => {
    const transferDurations = NJTTripManager.getTransferDurations([])
    expect(transferDurations).toEqual([])
  })

  it('should return an empty array for a single-phase trip', () => {
    const transferDurations = NJTTripManager.getTransferDurations([phase1])
    expect(transferDurations).toEqual([])
  })

  it('should return an array of 1 element, containing the transfer difference between 2 phases', () => {
    const transferDurations = NJTTripManager.getTransferDurations([phase1, phase2])
    expect(transferDurations).toEqual([71])
  })

  it('should return an array of 2 elements, containing the transfer difference between 3 phases', () => {
    const transferDurations = NJTTripManager.getTransferDurations([phase1, phase2, phase3])
    expect(transferDurations).toEqual([71, 58])
  })
})
