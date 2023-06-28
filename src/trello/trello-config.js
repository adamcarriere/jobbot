// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import loadAndParseYamlFile from '../utils/load-and-parse-yaml-file.js'
import path from 'node:path'

const filepath = path.join(process.cwd(), './config/trello.config.yaml')

const config = loadAndParseYamlFile(filepath,
  e => {
    throw new Error('Missing trello config file. Run "npm run util/init -- [name of new board] to create a new board and file, then copy that file to the config directory."')
  }
)

export default {
  ...config
}
