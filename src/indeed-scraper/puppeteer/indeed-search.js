import evaluateListingElement from './evaluate-listing-element.js'
import { getBrowser } from './get-browser.js'

export async function getJobListingsForParams ({ what, where, when }) {
  const browser = await getBrowser()
  const page = await browser.newPage()
  try {
    console.log('navigating to Indeed')

    console.log(`searching for jobs for "${what}" in "${where}"`)

    const q = `q=${encodeURIComponent(what)}`
    const l = `l=${encodeURIComponent(where)}`
    const fromage = when ? `fromage=${when}` : ''

    const params = [q, l, fromage]

    const indeedUrl = `https://ca.indeed.com/jobs?${params.join('&')}`
    console.log(`Navigating to ${indeedUrl}`)
    await page.goto(indeedUrl)
    const scrape = async (inJobs = []) => {
      const jobs = []

      try {
        await page.waitForSelector('.jobsearch-ResultsList', { timeout: 5000 })
        console.log(inJobs.length)
        console.log('Scraping page...')
        await page.mouse.click(1920 / 2, 10) // sometimes, there's a popup

        const jobListings = await page.$$('.result')

        for (let i = 0; i < jobListings.length; i++) {
          console.log(`Scraping job ${i + 1} of ${jobListings.length}`)
          const listingElement = jobListings[i]
          jobs.push({ ...(await evaluateListingElement(listingElement)), query: { what, where, when } })
        }
      } catch (err) {
        console.log(`There were no jobs at ${indeedUrl}`)
      }

      const nextBtn = await page.$('a[data-testid="pagination-page-next"]')

      const outJobs = [...inJobs, ...jobs]
      if (nextBtn == null) {
        browser.close()
        return outJobs
      }

      const nextPath = await nextBtn.evaluate(el => el.href)
      console.log(`Next page: ${nextPath}`)
      await page.goto(nextPath)
      return await scrape(outJobs)
    }

    return await scrape()
  } catch (e) {
    console.error(e)
    process.exit(0)
  }
}
