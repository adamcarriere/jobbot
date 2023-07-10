// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import getPromptForPosting from './openai/analyze-job-listing.js'
import openai from './openai/openai-instance.js'
import optimizeListing from './token-optimization/optimize-listing.js'
import * as store from './data/data-helpers.js'
import { createTrelloCardForListing } from './trello/create-cards.js'

function screenListing (listing) {
  const optimized = optimizeListing(listing)
  const { compressed } = optimized
  const openAiRequest = getPromptForPosting(compressed)
  return { ...optimized, openAiRequest }
}

async function requestOpenAi (listing) {
  const { openAiRequest, id } = listing
  return new Promise((resolve, reject) => {
    console.log(`Sending openai api request for ${id}`)
    openai().createChatCompletion(openAiRequest)
      .then(({ data }) => resolve(data))
      .catch(e => reject(e))
  })
}

export async function screenListings (results = []) {
  const prescreened = results.map(screenListing).filter(l => l.status !== 'NO_ENGLISH')
  const screenings = await Promise.all(prescreened.map((listing, index) => {
    return new Promise((resolve, reject) => {
      const { id } = listing
      const timeout = index * 20 * 1000
      console.log(`Will send request for ${id} in ${timeout / 1000}s`)
      setTimeout(() => {
        requestOpenAi(listing)
          .then(data => {
            console.log(`... got response for ${id}`)
            const entry = { ...listing, status: 'ANALYZED', openAiResponse: data }
            store.addListing(entry)
            createTrelloCardForListing(entry).then(val => {
              store.updateListing({ ...listing, status: 'POSTED', trello: val }).then(() => {})
              resolve(entry)
            })
          }).catch(openAiError => resolve({ ...listing, status: 'OPENAI_ERROR', openAiError }))
      }, timeout)
    })
  }))
  return screenings
}
