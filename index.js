// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import scrapeIndeedWithQuery from './src/indeed-scraper/scrape-indeed-with-queries.js'
import filterUnprocessedResults from './src/data/filter-unprocessed-resutls.js'
import scrapeDescriptionFromListing from './src/indeed-scraper/scrape-description-from-listing.js'
import { screenListings } from './src/process-result.js'
import config from './src/config.js'

process.setMaxListeners(100)

const applyDescriptionToListing = async listing => {
  return new Promise((resolve) => {
    scrapeDescriptionFromListing(listing)
      .then(description =>
        resolve({ description, ...listing })
      )
  })
}

const { queries } = config

const main = async () => {
  console.log('Starting job search...')

  for (const query of queries) {
    console.log(`========== STARTING NEW QUERY for "${query.what} | ${query.where} ==========`)
    const indeedResults = await scrapeIndeedWithQuery(query)

    // filter out results that already exist in the datastore
    const resultsToProcess = await filterUnprocessedResults(indeedResults)

    // get the job description from the full listing
    const listings = await Promise.all(resultsToProcess.map(applyDescriptionToListing))

    // screen the listings with a prescreening and ChatGPT
    await screenListings(listings)
  }
}

await main()

console.log('Done')
