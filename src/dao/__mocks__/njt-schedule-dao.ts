import * as fs from 'fs'
import { promisify } from 'util'
import * as moment from 'moment'

const readFileAsync = promisify(fs.readFile)

export const getScheduleFromNJTPage = async (
  originStation: string,
  originId: string,
  destStation: string,
  destinationId: string,
  date: moment.Moment
) => {
  let schedulePagePath
  if (originStation === 'Aberdeen Matawan' && destStation === 'Allenhurst') {
    schedulePagePath = `${__dirname}/njt-schedule-page-with-transfers.html`
  } else {
    schedulePagePath = `${__dirname}/njt-schedule-page.html`
  }

  return await readFileAsync(schedulePagePath, 'utf8')
}
