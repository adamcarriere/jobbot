import * as store from './data/data-helpers.js'
import { createCardOnList } from './trello/trello-api.js'
import trelloConfig from './trello/trello-config.js'

const inboxList = trelloConfig.lists[0]

const labels = trelloConfig.labels

const parseListing = item => {
  const { id, title, company, salary, openAiResponse, url, status } = item
  const { choices } = openAiResponse

  const { content } = choices[0].message
  const contentSplit = content.split('\n')
  const score = contentSplit.shift()
  const summary = contentSplit.join('\n')

  return { id, title, company, salary, summary, score, url, status }
}

export const createTrelloCard = async listing => {
  const { title, company, salary, summary, score, url } = parseListing(listing)

  const name = `${score} - ${company.name} - ${title}`
  const salaryString = salary == null ? 'No salary listed' : `${salary.range.min} - ${salary.range.max ?? 'No max listed'}`

  const desc = `# Salary
  ${salaryString}

  # Summary
  ${summary}

  # Link
  ${url}
  
  # Location
  ${company.location}
  `
  const idLabels = labels.filter(label => {
    switch (label.color) {
      case 'red':
        return score < 20
      case 'orange':
        return score >= 20 && score < 40
      case 'yellow':
        return score >= 40 && score < 60
      case 'green':
        return score >= 60 && score < 80
      case 'blue':
        return score >= 80
      case 'purple':
        return true
      default:
        return false
    }
  }).map(l => l.id)

  const result = await createCardOnList(inboxList, name, desc, idLabels, url)
  store.updateListing({ ...listing, status: 'POSTED' }).then(() => {})
  return result
}

export default async function createCardsFromDataStore () {
  const listings = await store.getStoredListings([], { status: 'ANALYZED' }, item => {
    const { id, title, company, salary, openAiResponse, url, status } = item
    const { choices } = openAiResponse

    const { content } = choices[0].message
    const contentSplit = content.split('\n')
    const score = contentSplit.shift()
    const summary = contentSplit.join('\n')

    return { id, title, company, salary, summary, score, url, status }
  })

  return await Promise.all(listings.map(createTrelloCard))
}
