// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import { getJobListingsForParams } from './puppeteer/indeed-search.js'

export default async function scrapeIndeedWithQuery (query) {
  console.log('Loading Indeed...')
  const jobs = await getJobListingsForParams(query)

  console.log(`Scraped ${jobs.length}`)
  return jobs
}
