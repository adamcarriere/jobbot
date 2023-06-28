import { getJobListingsForParams } from './puppeteer/indeed-search.js'

export default async function scrapeIndeedWithQuery (query) {
  console.log('Loading Indeed...')
  const jobs = await getJobListingsForParams(query)

  console.log(`Scraped ${jobs.length}`)
  return jobs
}
