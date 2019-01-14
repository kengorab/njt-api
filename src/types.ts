export type Time = {
  hour: string
  minute: string
  amPm: string
}

export type StationInfo = {
  name: string
  lat: number
  long: number
  departureVisionEnabled: boolean
  departureVisionId: string
}

export type TripPhase = {
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
  duration: number
}

export type Trip = {
  phases: TripPhase[]
  transferDurations: number[]
}

export type ScheduleResult = {
  origin: {
    time: string
    trainLine: string
    trainNumber: number
  }
  transfer: null | {
    arrivalTime: string
    station: string
    departureTime: string
    trainLine: string
    trainNumber: number
    waitTime: number
  }
  arrivalTime: string
  travelTime: number
}

export type Schedule = {
  results: ScheduleResult[]
}
