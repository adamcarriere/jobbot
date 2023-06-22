import { getJobListingsForParams } from './puppeteer/indeed-search.js'

export default async function scrapeIndeedWithQueries (queries) {
  console.log(`Searching for ${queries.map(q => `"${q.what} | ${q.where}"`)}`)

  const searches = queries.map(getJobListingsForParams)
  const results = await Promise.all(searches)

  const jobs = results.flat()

  console.log(`Scraped ${jobs.length}`)
  const result = Object.assign({}, ...jobs)
  return result
}
