import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import config from '../config.js'

let data = null

const { DATAPATH } = config

const openFile = async () => {
  if (!fsSync.existsSync(DATAPATH)) {
    await fs.writeFile(DATAPATH, JSON.stringify({}))
  }

  const dataBuffer = await fs.readFile(DATAPATH, 'utf-8')
  data = JSON.parse(dataBuffer)
}

await openFile()

/**
 * A default reducer. Simply returns the input as is.
 * @param {any} data
 * @returns {any}
 */
export const defaultReducer = data => data

/**
 * Returns all the data from the data store
 * @param {data => any} reducer
 * @returns
 */
export const get = async (reducer = defaultReducer) => {
  // open or create the data.json file
  if (data == null) {
    await openFile()
  }
  return reducer(data)
}

const writeStack = []

export const set = (value) => {
  data = { ...data, ...value }
  writeStack.push({ ...data })
  checkStack()
}

let writeLoop = null

const checkStack = () => {
  if (writeLoop != null) {
    return new Promise(resolve => resolve())
  }

  return new Promise(resolve => {
    writeLoop = setInterval(() => {
      if (writeStack.length === 0) {
        clearInterval(writeLoop)
        writeLoop = null
        resolve()
        return
      }

      const d = writeStack.shift()
      fsSync.writeFileSync(DATAPATH, JSON.stringify(d))
    })
  })
}
