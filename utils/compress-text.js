// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import fs from 'node:fs'
import { applySentenceCompression } from '../src/token-optimization/sentence-compression.js'

const args = process.argv.splice(2)
console.log(args)

const filepath = args[0]
console.log(filepath)
const outpath = args[1]
console.log(outpath)

const contents = fs.readFileSync(filepath, 'utf-8')

const compressed = applySentenceCompression(contents)

fs.writeFileSync(outpath, compressed)

console.log('Compressed.')
