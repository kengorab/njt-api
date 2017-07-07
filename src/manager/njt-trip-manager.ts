import * as cheerio from 'cheerio'
import * as _ from 'lodash'
import * as NJTDao from '../dao/njt-dao'
import * as moment from 'moment'

const departureRE = /depart\s*:\s*(.*)at\s*([\d|:]*)\s*(PM|AM)/i
const boardRE = /board\s*:\s*train\s*(\d*)\s*toward\s*(.*)/i
const arrivalRE = /arrive\s*:\s*(.*)at\s*([\d|:]*)\s*(PM|AM)/i

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
    const departure = { from: from.trim(), at: `${dTime} ${dTimeAmPm}` }

    const [trainNumber, towards] = boardRE.exec(boardingStr)!!.slice(1)
    const board = { trainNumber, towards }

    const [destination, aTime, aTimeAmPm] = arrivalRE.exec(arrivalStr)!!.slice(1)
    const arrival = { destination: destination.trim(), at: `${aTime} ${aTimeAmPm}` }

    return { departure, board, arrival }
  })
}

export async function getTripOptionsFromNJTPage(
  origin: StationInfo,
  destination: StationInfo,
  tripDate: moment.Moment
): Promise<Trip[]> {
  const njtPageText = await NJTDao.getNJTPageText(origin, destination, tripDate)
  const $ = cheerio.load(njtPageText)
  const panelTexts = $('.AccordionPanel .AccordionPanelContent')
    .map((_, panel) => $(panel).text())
    .get()
  return panelTexts.map(panelText => ({ phases: getTripPhases(panelText) }))
}
