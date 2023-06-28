// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import { getListingIds } from './data-helpers.js'

/**
 * Remove any job search results that already exist in the data-store
 * @param {any[]} results Job search results to filter
 * @returns {any[]} An array of job search results that don't exist in the data store
 */
export default async function filterUnprocessedResults (results) {
  console.log('Filtering unprocessed results...')
  const listingIds = await getListingIds()

  const filtered = results.filter(res => {
    if (listingIds.includes(res.id)) {
      console.log(`${res.id} has already been processed`)
      return false
    }

    console.log(`${res.id} ready to process`)
    return true
  })

  return filtered
}
