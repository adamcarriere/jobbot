import axios from 'axios'
import config from '../config.js'

const baseUrl = 'https://api.trello.com/1'

const { TRELLOAPI_KEY, TRELLOAPI_TOKEN } = config
const key = TRELLOAPI_KEY
const token = TRELLOAPI_TOKEN
const auth = { key, token }

export const createTrelloBoard = async (name) => {
  console.log(`key: ${key} token: ${token}`)

  try {
    const result = await axios.post(`${baseUrl}/boards`, null, {
      params: {
        name,
        defaultLabels: false,
        defaultLists: false,
        ...auth
      }
    })
    return result
  } catch ({ message, config }) {
    return { message, config }
  }
}

// 'https://api.trello.com/1/lists?name={name}&idBoard=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
export const createListOnBoard = async (name, idBoard, pos) => {
  const result = await axios.post(`${baseUrl}/lists`, null, {
    params: {
      name,
      idBoard,
      pos: pos + 1,
      ...auth
    }
  })

  return result
}

// https://api.trello.com/1/cards?idList=5abbe4b7ddc1b351ef961414&key=APIKey&token=APIToken'
export const createCardOnList = async (idList, name, desc) => {
  try {
    const result = await axios.post(`${baseUrl}/cards`, null, {
      params: {
        idList,
        name,
        desc,
        ...auth
      }
    })
    return result
  } catch ({ message, config }) {
    return { message, config }
  }
}
