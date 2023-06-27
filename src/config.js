import loadAndParseYamlFile from './utils/load-and-parse-yaml-file.js'
import path from 'node:path'

const filepath = path.join(process.cwd(), './config/.config.yaml')

const config = loadAndParseYamlFile(filepath,
  e => { throw new Error('Missing .config.yaml file') }
)

export default {
  ...config
}
