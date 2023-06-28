// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

// import axios from 'axios'
import { createLabelForBoard, createListOnBoard, createTrelloBoard, getMemberId } from '../src/trello/trello-api.js'
import yaml from 'yaml'
import fs from 'node:fs'
import config from '../src/config.js'

const { TRELLOAPI_KEY, TRELLOAPI_TOKEN } = config

const args = process.argv.splice(2)
const boardName = args[0]
const outFile = 'trello.config.yaml'

console.log(`========== CREATING BOARD NAMED "${boardName}" ==========`)
console.log(`Trello api key: ${TRELLOAPI_KEY}`)
console.log(`Trello api token: ${TRELLOAPI_TOKEN}`)

const memberId = await getMemberId(args[1])

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

const labelNames = {
  purple: 'From Jobbot',
  red: 'Not suitable',
  orange: 'Less suitable',
  yellow: 'Suitable',
  green: 'More suiteable',
  blue: 'Excellent',
  lime: '$$$'
}

const labelObjects = Object.keys(labelNames).map(key => {
  return { color: key, name: labelNames[key] }
})

const labelResponses = await Promise.all(labelObjects.map(({ name, color }) => createLabelForBoard(name, color, newBoard)))

const labels = labelResponses.map(l => {
  const { id, color, name } = l.data
  return { id, color, name }
})

const { id, url } = board

const data = {
  board: { id, url },
  lists,
  labels,
  memberId
}

const yml = yaml.stringify({ ...data })

fs.writeFileSync(outFile, yml)
console.log(yml)
console.log('Done')
console.log(`Created Trello config in "${outFile}". Copy this to the config folder for the app to use.`)
