import getPromptForPosting from './openai/analyze-job-listing.js'
import openai from './openai/openai-instance.js'
import optimizeListing from './token-optimization/optimize-listing.js'
import util from 'node:util'
import * as store from './data/data-helpers.js'

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
  const prescreened = results.map(screenListing).filter(l => l.status !== 'FRENCH_ONLY')
  const screenings = await Promise.all(prescreened.map((listing, index) => {
    return new Promise((resolve, reject) => {
      const { id } = listing
      const timeout = index * 20 * 1000
      console.log(`Will send request for ${id} in ${timeout / 1000}s`)
      setTimeout(() => {
        requestOpenAi(listing)
          .then(data => {
            console.log(`Response for ${id}`)
            console.log(util.inspect(data, { colors: true, depth: null }))
            const entry = { ...listing, status: 'ANALYZED', openAiResponse: data }
            store.addListing(entry)
            resolve(entry)
          }).catch(openAiError => resolve({ ...listing, status: 'OPENAI_ERROR', openAiError }))
      }, timeout)
    })
  }))
  return screenings
}
