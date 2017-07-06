declare type Time = {
  hour: string
  minute: string
  amPm: string
}

declare type LatLong = {
  lat: number
  long: number
}

declare type StationInfo = {
  name: string
  lat: number
  long: number
  departureVisionEnabled: boolean
  departureVisionId: string
}
