// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import { Configuration, OpenAIApi } from 'openai'
import config from '../config.js'

const { OPENAI_KEY } = config

let instance = null

/**
 *
 * @returns {OpenAIApi}
 */
const openai = () => {
  if (instance != null) return instance

  const configuration = new Configuration({
    apiKey: OPENAI_KEY
  })

  instance = new OpenAIApi(configuration)
  return instance
}

export default openai
