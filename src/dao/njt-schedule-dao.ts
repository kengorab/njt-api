import * as moment from 'moment'

// Used in scripts/get-schedule-ids.js
export async function getBasePage(): Promise<string> {
  const url = 'http://www.njtransit.com/sf/sf_servlet.srv?hdnPageAction=TrainTo'

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed fetching page from NJT: ${response.statusText}`)
  }

  return response.text()
}

function getBody(
  originStation: string,
  originId: string,
  destStation: string,
  destinationId: string,
  date: moment.Moment
): string {
  const body = {
    'selOrigin': originId,
    'selDestination': destinationId,
    'datepicker': date.format('MM/DD/YYYY'),
    'OriginDescription': originStation,
    'DestDescription': destStation
  }

  return Object.entries(body)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&')
}

export async function getScheduleFromNJTPage(
  originStation: string,
  originId: string,
  destStation: string,
  destinationId: string,
  date: moment.Moment
): Promise<string> {
  const url = 'http://www.njtransit.com/sf/sf_servlet.srv?hdnPageAction=TrainSchedulesFrom'
  const headers = {
    'Pragma': 'no-cache',
    'Origin': 'http://www.njtransit.com',
    'Accept-Language': 'en-US,en;q=0.8',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'DNT': '1'
  }
  const body = getBody(
    originStation, originId,
    destStation, destinationId,
    date
  )

  const response = await fetch(url, { method: 'POST', body, headers })
  if (!response.ok) {
    throw new Error(`Failed fetching page from NJT: ${response.statusText}`)
  }
  return response.text()
}
