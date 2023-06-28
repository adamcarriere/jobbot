// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import indeedParseListingPage from './puppeteer/indeed-parse-listing-page.js'

export default async function scrapeDescriptionFromListing (result) {
  console.log(`Get description for ${result.id} at ${result.url}`)
  return indeedParseListingPage(result)
}
