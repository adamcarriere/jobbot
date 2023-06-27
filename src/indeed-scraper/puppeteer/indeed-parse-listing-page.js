import { getBrowser } from './get-browser.js'

export default async function indeedParseListingPage ({ url }) {
  const browser = await getBrowser()
  const page = await browser.newPage()
  console.log(`navigating to ${url}`)
  await page.goto(url)
  const descriptionElement = await page.waitForSelector('.jobsearch-JobComponent-description')
  const description = await descriptionElement.$eval('#jobDescriptionText', el => el.innerText)
  await browser.close()
  return description
}
