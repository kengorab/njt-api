import * as _ from 'lodash'
import * as NJTDao from '../dao/njt-dao'
import * as moment from 'moment'
import globals from '../globals'

const departureRE = /depart\s*:\s*(.*)at\s*([\d|:]*)\s*(PM|AM)/i
const boardRE = /board\s*:\s*train\s*(\d*)\s*toward\s*(.*)/i
const arrivalRE = /arrive\s*:\s*(.*)at\s*([\d|:]*)\s*(PM|AM)/i

// Visible for testing
export function getDuration(startTimeStr: string, endTimeStr: string): number {
  const startTime = moment(startTimeStr, 'h:mm a')
  const endTime = moment(endTimeStr, 'h:mm a')

  // Handle the case when endTime is past midnight
  if (endTime.isBefore(startTime)) {
    return endTime.add(1, 'day').diff(startTime, 'm')
  }

  return endTime.diff(startTime, 'm')
}

// Visible for testing
export function getTransferDurations(phases: TripPhase[]): number[] {
  if (phases.length < 2) {
    return []
  }

  return phases
    .map((phase, index, arr) => {
      if (index === arr.length - 1) {
        return null
      }

      const nextPhase = arr[index + 1]
      return getDuration(phase.arrival.at, nextPhase.departure.at)
    })
    .filter(_ => _ !== null)
}

// Visible for testing
export function getTripPhases(tripString: string): TripPhase[] {
  const tripStages = tripString.replace('\t', '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length !== 0)
    .filter(line => line.startsWith('Depart') || line.startsWith('Board') || line.startsWith('Arrive'))

  const transfers = _.chunk(tripStages, 3)
  return transfers.map(([departureStr, boardingStr, arrivalStr]) => {
    const [from, dTime, dTimeAmPm] = departureRE.exec(departureStr)!!.slice(1)
    const departureTimeStr = `${dTime} ${dTimeAmPm}`
    const departure = { from: from.trim(), at: departureTimeStr }

    const [trainNumber, towards] = boardRE.exec(boardingStr)!!.slice(1)
    const board = { trainNumber, towards }

    const [destination, aTime, aTimeAmPm] = arrivalRE.exec(arrivalStr)!!.slice(1)
    const arrivalTimeStr = `${aTime} ${aTimeAmPm}`
    const arrival = { destination: destination.trim(), at: arrivalTimeStr }

    const duration = getDuration(departureTimeStr, arrivalTimeStr)

    return { departure, board, arrival, duration }
  })
}

export async function getTripOptionsFromNJTPage(
  origin: StationInfo,
  destination: StationInfo,
  tripDate: moment.Moment
): Promise<Trip[]> {
  const njtPageText = await NJTDao.getNJTPageText(origin, destination, tripDate)
  const { cheerio } = globals
  const $ = cheerio.load(njtPageText)
  const panelTexts = $('.AccordionPanel .AccordionPanelContent')
    .map((_, panel) => $(panel).text())
    .get()

  return panelTexts.map(panelText => {
    const phases = getTripPhases(panelText)
    const transferDurations = getTransferDurations(phases)

    return { phases, transferDurations }
  })
}
