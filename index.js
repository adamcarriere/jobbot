import scrapeIndeedWithQueries from './src/indeed-scraper/scrape-indeed-with-queries.js'
import filterUnprocessedResults from './src/data/filter-unprocessed-resutls.js'
import scrapeDescriptionFromListing from './src/indeed-scraper/scrape-description-from-listing.js'
import { screenListings } from './src/process-result.js'
import * as dataStore from './src/data/data-store.js'

process.setMaxListeners(100)

const applyDescriptionToListing = async listing => {
  return new Promise((resolve) => {
    scrapeDescriptionFromListing(listing)
      .then(description =>
        resolve({ description, ...listing })
      )
  })
}

const main = async () => {
  console.log('Starting job search...')

  const indeedResults = await scrapeIndeedWithQueries([{
    what: 'nodejs developer',
    where: 'Montréal, QC',
    when: 14
  }])

  // filter out results that already exist in the datastore
  const resultsToProcess = await filterUnprocessedResults(indeedResults)

  // get the job description from the full listing
  const listings = await Promise.all(resultsToProcess.map(applyDescriptionToListing))

  // screen the listings with a prescreening and ChatGPT
  const screenedListings = await screenListings(listings)

  return screenedListings
}

await main()

console.log('Done')
