import indeedParseListingPage from './puppeteer/indeed-parse-listing-page.js'

export default async function scrapeDescriptionFromListing (result) {
  console.log(`Get description for ${result.id} at ${result.url}`)
  return indeedParseListingPage(result)
}
