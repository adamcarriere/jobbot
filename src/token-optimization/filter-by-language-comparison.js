import { franc, francAll } from 'franc-min'

const langFromArray = (lang, langs) => {
  return langs.filter(l => l[0] === lang)[0]
}

export default function filterByLanguageComparison (str, langA, langB, { matchExpression = /./, haltExpression = /^$/, threshold = 0.1, verbose = false }) {
  const blocks = str.split(/\r?\n/)

  const log = (str) => {
    if (verbose) {
      console.log(str)
    }
  }

  log(matchExpression)
  const filteredBlocks = blocks.filter(block => {
    log('==========')
    log(block)

    // if matches the halt expression, return false
    if (haltExpression.test(block)) {
      log('... halt match')
      log('==========')
      return false
    }

    // if it matches the wildcard expression return true
    if (matchExpression.test(block)) {
      log('... expression match')
      log('==========')
      return true
    }

    // language test
    const langs = francAll(block)

    // if the lang is undefined, return true
    if (langs[0][0] === 'und') return false

    const langAResult = langFromArray(langA, langs)[1]
    const langBResult = langFromArray(langB, langs)[1]

    const diff = langBResult - langAResult

    log(`langAResult: ${langAResult}`)
    log(`langBResult: ${langBResult}`)
    log(`More langB than langA: ${diff}`)
    log('==========')

    // if the difference is less than the threshold return true
    if (diff <= threshold) return true

    return false
  })

  const filtered = filteredBlocks.join('\n')
  const lastLang = franc(filtered)

  console.log(`FILTERED IS ${lastLang}`)
  if (lastLang === langB || lastLang === 'und') return null

  return filtered
}
