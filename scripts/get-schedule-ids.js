require('isomorphic-fetch')
const cheerio = require('cheerio')
const fs = require('fs')
const { promisify } = require('util')
const NJTScheduleDao = require('../src/dao/njt-schedule-dao')

const writeFileAsync = promisify(fs.writeFile)

async function getStationScheduleIds() {
  const html = await NJTScheduleDao.getBasePage()

  const $ = cheerio.load(html)

  const options = $('select').first()
    .find('option')
    .map((_, opt) => ({
      text: $(opt).text(),
      value: $(opt).attr('value')
    }))
    .get()
    .filter(item => item.text !== 'Select Station')
  const scheduleIds = options
    .reduce((acc, { text, value }) => ({ ...acc, [text]: value }), {})

  const jsonOutputFileName = `${__dirname}/../data/schedule-ids.json`
  await writeFileAsync(
    jsonOutputFileName,
    JSON.stringify(scheduleIds, null, 2),
    { encoding: 'utf-8' }
  )
  console.log('Wrote JSON file:', jsonOutputFileName)

  const typeDeclarationFileHeader = 'declare type StationName ='
  const typeDeclarationFile = Object.keys(scheduleIds)
    .reduce((acc, stationName) => `${acc}\n  | '${stationName}'`, typeDeclarationFileHeader)
  const typeDeclarationOutputFileName = `${__dirname}/../src/station-name.d.ts`
  await writeFileAsync(
    typeDeclarationOutputFileName,
    typeDeclarationFile,
    { encoding: 'utf-8' }
  )
  console.log('Wrote type declaration file:', typeDeclarationOutputFileName)
}

getStationScheduleIds()
  .then(() => console.log('Success'))
  .catch(err => console.error('Encountered error:', err))
