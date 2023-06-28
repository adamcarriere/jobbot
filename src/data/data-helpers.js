import * as store from './data-store.js'
import { v4 as uuidv4 } from 'uuid'
/**
 * Gets all listings from the data store.
 *
 * @param {string[]} keys Returns objects with the provided keys. Example (keys = ['foo', 'bar'] returns { foo, bar }). If no keys are provided, returns all keys.
 * @param {Function} reducer A reducer function to be applied to every item before being returned. Useful for formatting responses.
 * @returns {Promise<any[]>}
 */
export const getStoredListings = async (keys = [], filter = {}, reducer = store.defaultReducer) => {
  const data = await store.get(
    data => {
      return Object.keys(data).map(
        key => {
          const item = data[key]
          if (keys.length === 0) return item

          return Object.assign({}, ...keys.map(k => { return { [k]: item[k] } }))
        })
    })

  return data
    .filter(item => {
      for (const k in filter) {
        if (!Object.keys(item).includes(k)) continue
        if (item[k] !== filter[k]) {
          return false
        }
      }
      return true
    }).map(reducer)
}

/**
 * Gets all the Indeed ids from stored listings in the store
 * @returns {Promise<string[]>}
 */
export const getListingIds = async () => {
  return getStoredListings(['id'], {}, ({ id }) => id)
}

/**
 * Adds a listing to the data store
 * @param {any} listing
 */
export const addListing = listing => {
  const uuid = uuidv4()

  const item = { [uuid]: listing }
  store.set(item)
}

export const updateListing = async listing => {
  const storedListing = (await store.get(data => {
    return Object.keys(data).filter(key => data[key].id === listing.id)
  }))[0]

  const item = { [storedListing]: listing }
  store.set(item)
}
