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
