# njt-api
[![Build Status](https://travis-ci.org/kengorab/njt-api.svg?branch=master)](https://travis-ci.org/kengorab/njt-api)

A Javascript ([Typescript](https://www.typescriptlang.org/)) API for accessing trip information for NJTransit trains

## API Usage
After installing this package with `yarn add njt-api` (or `npm install njt-api --save`), you can either import the default import, or import the `Stations` and `Trips` sub-sections of the API:

```javascript
import * as NJTApi from 'njt-api'
// or
import { Trips, Stations } from 'njt-api'
```

When using in a React Native project, you'll need to import slightly differently:

```javascript
import * as NJTApi from 'njt-api/native'
```

This is because underlying packages within the library (`cheerio`, namely) do not work within React Native, and need to be swapped out with compatible packages, depending on the context. Other than the change in import path though, the remainder of the API is the same.

Each sub-section has its usages documented below, with signatures/types described using Typescript.

## Stations
```javascript
import { Stations } from 'njt-api'
```

| Function | Returns                                                                        | Notes                                                               |
|---       |---                                                                             |---                                                                  |
| `Stations.getStationNames()`                   | `string[]`                               |                                                                     |
| `Stations.getStations()`                       | `{ [stationName: string]: StationInfo }` |                                                                     |
| `Stations.getStationInfo(stationName: string)` | `StationInfo`                            | Will throw an `Error` if given an unrecognized/invalid station name |

where `StationInfo` is defined as:

```typescript
type StationInfo = {
  name: string
  lat: number
  long: number
  departureVisionEnabled: boolean
  departureVisionId: string
}
```

## Trips
```javascript
import { Trips } from 'njt-api'
```

As of right now, there is only one function in the `Trip` sub-section of the API:

```typescript
Trips.getTripOptions(fromStation: string, toStation: string, when?: Date | string): Promise<Trip[]>
```

where `Trip` is defined as:

```typescript
type Trip = {
  phases: TripPhase[]
  transferDurations: number[]  // For trips with multiple phases, the amount (in minutes) of each transfer wait
}
```

and `TripPhase` is defined as:

```typescript
type TripPhase = {
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
  duration: number  // Duration of the trip phase (in minutes)
}
```

The `getTripOptions` function returns 3 trip options, each of which can have multiple 'phases'. For example, traveling between station X and Y might have options 1 and 2 which are direct, but option 3 which has a transfer at station Z. Direct trips only have a single trip phase, but trips with transfers will have a phase for each leg of the trip.

*Notes*:
  - The `getTripOptions` Promise will fail if given an unrecognized/invalid station name for either the `fromStation` or `toStation`
  - The third parameter (`when`) is optional, and will default to the current date and time. If an invalid `Date` is passed, or an invalidly formatted date string (or any other non-Date, non-string object) the `getTripOptions` Promise will fail.
  - This Promise typically takes a few seconds (yeah, I know) since it's making requests to the NJTransit website and parsing responses. I'd like for that to not be the case, but it's likely the best I can do.

## Important Notes
I obviously do not own the rights to New Jersey Transit, NJTransit, NJT, or any other potentially copyrighted terms used in this document or API.
