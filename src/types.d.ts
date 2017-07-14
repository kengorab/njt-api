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
  duration: number
}

declare type Trip = {
  phases: TripPhase[]
}

// The api for cheerio-without-node-native is exactly the same as
// standard cheerio, but lacks a type definition under @types.
declare module 'cheerio-without-node-native' {
  export = cheerio
}
