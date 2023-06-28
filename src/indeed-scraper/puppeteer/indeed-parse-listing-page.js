// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

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
