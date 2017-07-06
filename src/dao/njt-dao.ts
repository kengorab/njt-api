import fetch from 'node-fetch'
import * as moment from 'moment'

const defaultParameters = {
  'time': 'D',
  'mode': 'CTR',
  'min': 'T',
  'Walk': '0.50'
}

function getBody(
  origin: StationInfo,
  destination: StationInfo,
  date: moment.Moment,
  timeObj: Time
): string {
  const parameters = {
    'starting_street_address': origin.name,
    'dest_street_address': destination.name,
    'datepicker': date.format('MM/DD/YYYY'),
    'Time': `${timeObj.hour}:${timeObj.minute}`,
    'Suffix': timeObj.amPm,
    'Hour': timeObj.hour,
    'Minute': timeObj.minute,
    'TravelToLatLong': `${destination.lat},${destination.long}`,
    'TravelFromLatLong': `${origin.lat},${origin.long}`
  }

  const allParameters = Object.assign(parameters, defaultParameters)
  return Object.entries(allParameters)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
}

const url = 'http://www.njtransit.com/sf/sf_servlet.srv?hdnPageAction=TripPlannerItineraryFrom'
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

export async function getNJTPageText(
  origin: StationInfo,
  destination: StationInfo,
  tripDate: moment.Moment
): Promise<string> {
  const timeObj: Time = {
    hour: moment(tripDate).format('h'),
    minute: moment(tripDate).format('mm'),
    amPm: moment(tripDate).format('A')
  }

  const body = getBody(origin, destination, tripDate, timeObj)
  const response = await fetch(url, { method: 'POST', body, headers })
  if (!response.ok) {
    throw new Error(`Failed fetching page from NJT: ${response.statusText}`)
  }
  return response.text()
}

