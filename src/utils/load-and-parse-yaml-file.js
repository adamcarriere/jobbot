// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import fs from 'node:fs'
import { parse } from 'yaml'

export default function loadAndParseYamlFile (path, onerror = () => {}) {
  try {
    const contents = fs.readFileSync(path, 'utf-8')
    return parse(contents)
  } catch (e) {
    onerror(e)
    return e
  }
}
