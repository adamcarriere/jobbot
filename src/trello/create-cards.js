// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import * as store from '../data/data-helpers.js'
import { createCardOnList } from './trello-api.js'
import trelloConfig from './trello-config.js'

const inboxList = trelloConfig.lists[0]

const labels = trelloConfig.labels

export const parseListing = item => {
  const { id, title, company, salary, openAiResponse, url, status } = item
  const { choices } = openAiResponse

  const { content } = choices[0].message
  const contentSplit = content.split('\n')
  const score = contentSplit.shift()
  const summary = contentSplit.join('\n')

  return { id, title, company, salary, summary, score, url, status }
}

export const createTrelloCardForListing = async listing => {
  const { title, company, salary, summary, score, url } = parseListing(listing)

  const scoreStr = score.replace(/[A-Za-z:]*/, '').replace(/\/(.*)/, '').trim()

  const name = `${scoreStr} - ${company.name} - ${title}`
  const salaryString = salary == null ? 'No salary listed' : `${salary.range.min} - ${salary.range.max ?? '(No max listed)'}  ${salary.rate}`
  const salaryVal = salary == null ? 0 : (salary.range == null ? 0 : salary.range.min ?? (salary.range.max ?? 0))
  const desc = `# Salary
  ${salaryString}

  # Summary
  ${summary}

  # Link
  ${url}
  
  # Location
  ${company.location}
  `
  const scoreVal = parseInt(scoreStr)
  const idLabels = labels.filter(label => {
    switch (label.color) {
      case 'red':
        return scoreVal < 40
      case 'orange':
        return scoreVal >= 40 && scoreVal < 60
      case 'yellow':
        return scoreVal >= 60 && scoreVal < 80
      case 'green':
        return scoreVal >= 80 && scoreVal < 90
      case 'blue':
        return scoreVal >= 90
      case 'purple':
        return true
      case 'lime':
        return salaryVal >= 100000
      default:
        return false
    }
  }).map(l => l.id)

  const { member } = trelloConfig
  const result = await createCardOnList({ idList: inboxList, name, desc, idLabels, idMembers: [member] })
  store.updateListing({ ...listing, status: 'POSTED' }).then(() => {})

  return result
}

export async function createCardsFromDataStore () {
  const listings = await store.getStoredListings([], { status: 'ANALYZED' }, item => {
    const { id, title, company, salary, openAiResponse, url, status } = item
    const { choices } = openAiResponse

    const { content } = choices[0].message
    const contentSplit = content.split('\n')
    const score = contentSplit.shift()
    const summary = contentSplit.join('\n')

    return { id, title, company, salary, summary, score, url, status }
  })

  return await Promise.all(listings.map(createTrelloCardForListing))
}
