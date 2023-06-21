/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { getDatabase } from 'firebase-admin/database'
import * as admin from 'firebase-admin'
import getSnapshotKeys from './get-snapshot-keys'

admin.initializeApp()
const db = getDatabase()

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const addJobListingsForProcessing = onRequest(async ({ body }, response) => {
  // // logger.log('Hey, I\'ve been called!')
  // // response.send('Hey good lookin!!')
  // response.send(JSON.stringify(body.params, null, 2))
  logger.log('Received jobs to add for processing...')

  const dbRef = db.ref()
  const toProcessRef = dbRef.child('toProcess')
  const processedRef = dbRef.child('processed')

  const getAlreadyProcessed = async (): Promise<string[]> => {
    const processed = await processedRef.get()
    const toProcess = await toProcessRef.get()

    return [...getSnapshotKeys(processed), ...getSnapshotKeys(toProcess)]
  }

  const excluded = await getAlreadyProcessed()

  logger.log('Running pre-screening...')

  const searchResults = body.params.jobSearchResults

  const added = []

  for (const id in searchResults) {
    if (excluded.includes(id)) {
      logger.log(`${id} has already been processed`)
      continue
    }

    logger.log(`${id} to be added for processing`)
    const newEntry = searchResults[id]

    await toProcessRef.update({ [id]: newEntry })
    added.push(id)
  }
  const resultMsg = `Added ${added.length} new listings for processing:\n${added.join('\n')}`

  response.send(resultMsg)
})
