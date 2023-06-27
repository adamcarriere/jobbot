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
