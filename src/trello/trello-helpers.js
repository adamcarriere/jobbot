import { createCardOnList } from './trello-api.js'
import trello from './trello-config.js'

export const createListingCardFromListing = async listing => {
  const { title, company, url } = listing

  const name = `${company.name} | ${title}`
  const desc = `${name}
  ${url}
  `

  return createCardOnList(trello.lists[0], name, desc)
}
