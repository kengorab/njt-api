import * as NJTScheduleDao from '../dao/njt-schedule-dao'
import * as moment from 'moment'
import globals from '../globals'
import { ScheduleResult } from '../types'

function parseTrainInfo(trainInfo: string): [string, number] {
  const [trainLine, trainNumber] = trainInfo.split(' #')
  return [trainLine, parseInt(trainNumber)]
}

export async function getScheduleFromNJTPage(
  originStation: string,
  originId: string,
  destStation: string,
  destinationId: string,
  date: moment.Moment
): Promise<ScheduleResult[]> {
  const njtPageText = await NJTScheduleDao.getScheduleFromNJTPage(
    originStation,
    originId,
    destStation,
    destinationId,
    date
  )

  const { cheerio } = globals
  const $ = cheerio.load(njtPageText)
  const table = $('b:contains(Origin)')
    .parents('table')
    .first()
  return table
    .find('tr')
    .toArray()
    .filter((_, idx) => idx !== 0)
    .map(row => {
      const $tr = $(row)
      const $tds = $tr.children('td')

      let $origin, $transfer, $destination, $travelTime
      if ($tds.length === 4) {
        ;[$origin, $transfer, $destination, $travelTime] = $tds.toArray()
      } else {
        ;[$origin, $destination, $travelTime] = $tds.toArray()
      }

      // Origin data
      const $originSpan = $($origin)
        .children('span')
        .first()
      const [originTime, originTrainInfo] = $originSpan
        .contents()
        .toArray()
        .map(n => $(n).text())
        .filter(text => text !== '')
      const [originLine, originTrainNumber] = parseTrainInfo(originTrainInfo)
      const origin = {
        time: originTime,
        trainLine: originLine,
        trainNumber: originTrainNumber
      }

      // Transfer data (if applicable)
      let transfer
      if ($transfer) {
        const $transferSpan = $($transfer)
          .children('span')
          .first()
        if ($transferSpan.children().length !== 0) {
          const [arriveTime, station, departTime, trainInfo] = $transferSpan
            .contents()
            .toArray()
            .map(n => $(n).text())
            .filter(text => text !== '')

          const arrivalTime = arriveTime.replace('Arrive ', '')
          const departureTime = departTime.replace('Depart ', '')

          const [trainLine, trainNumber] = parseTrainInfo(trainInfo)
          transfer = {
            arrivalTime,
            station,
            departureTime,
            trainLine,
            trainNumber
          }
        }
      }

      // Destination data
      const arrivalTime = $($destination)
        .children('span')
        .first()
        .text()

      // Travel time data
      const travelTime = $($travelTime)
        .children('span')
        .first()
        .text()
        .split(' ')[0]

      return {
        origin,
        transfer,
        arrivalTime,
        travelTime: parseInt(travelTime)
      }
    })
}
