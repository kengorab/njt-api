const path = require('path');
const jasmineReporters = require('jasmine-reporters');

jasmine.VERBOSE = true;
jasmine.getEnv().addReporter(
  new jasmineReporters.JUnitXmlReporter({
    consolidateAll: false,
    savePath: path.resolve(__dirname, '..', '..', 'test-results')
  })
);

//const globals = require('../../src/globals')
//const cheerio = require('cheerio')
//globals.cheerio = cheerio
