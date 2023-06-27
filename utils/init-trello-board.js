// import axios from 'axios'
import { createCardOnList, createListOnBoard, createTrelloBoard } from '../src/trello/trello-api.js'
import yaml from 'yaml'
import fs from 'node:fs'
import config from '../src/config.js'

const { TRELLOAPI_KEY, TRELLOAPI_TOKEN } = config

// const key = process.env.TRELLOAPI_KEY
// const token = process.env.TRELLOAPI_TOKEN

const boardName = process.argv.splice(2)[0]
const outFile = 'trello.config.yaml'

console.log(`========== CREATING BOARD NAMED "${boardName}" ==========`)
console.log(`Trello api key: ${TRELLOAPI_KEY}`)
console.log(`Trello api token: ${TRELLOAPI_TOKEN}`)

const { data: board } = await createTrelloBoard(boardName)
const newBoard = board.id

console.log(`New board created with id: ${newBoard}`)

const listNames = [
  'Inbox',
  'To Apply',
  'Applied',
  'Appointment',
  'Hold',
  'Offer',
  'Dead'
]

console.log(`Creating lists: ${listNames.join(' ')}`)

// const list = await createListOnBoard('test', newBoard)
const listResponses = await Promise.all(listNames.map((l, i) => createListOnBoard(l, newBoard, i)))

const lists = listResponses.map(l => l.data.id)

const { id, url } = board

const data = {
  board: { id, url },
  lists
}

// test cards
const tests = [
  { name: 'Lorem', desc: 'Ipsum' },
  { name: 'Lorem', desc: 'Ipsum' },
  { name: 'Lorem', desc: 'Ipsum' },
  { name: 'Lorem', desc: 'Ipsum' },
  { name: 'Lorem', desc: 'Ipsum' }
]

const cards = await Promise.all(tests.map(({ name, desc }) => createCardOnList(lists[0], name, desc)))
console.log(cards)
const yml = yaml.stringify({ ...data })

fs.writeFileSync(outFile, yml)
console.log('Done')
console.log(`Created Trello config in "${outFile}". Copy this to the config folder for the app to use.`)
