declare type Time = {
  hour: string
  minute: string
  amPm: string
}

declare type StationInfo = {
  name: string
  lat: number
  long: number
  departureVisionEnabled: boolean
  departureVisionId: string
}

declare type TripPhase = {
  departure: {
    from: string
    at: string
  }
  board: {
    trainNumber: string
    towards: string
  }
  arrival: {
    destination: string
    at: string
  }
}

declare type Trip = {
  phases: TripPhase[]
}
