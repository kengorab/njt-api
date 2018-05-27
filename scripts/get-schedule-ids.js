require('isomorphic-fetch')
const cheerio = require('cheerio')
const fs = require('fs')
const { promisify } = require('util')
const NJTScheduleDao = require('../src/dao/njt-schedule-dao')

const writeFileAsync = promisify(fs.writeFile)

const outputFile = `${__dirname}/../data/schedule-ids.json`

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

  await writeFileAsync(
    outputFile,
    JSON.stringify(scheduleIds, null, 2),
    { encoding: 'utf-8' }
  )
}

getStationScheduleIds()
  .then(() => console.log('Wrote:', outputFile))
  .catch(err => console.error('Encountered error:', err))
