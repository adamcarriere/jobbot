import scrapeIndeedWithQueries from '..'

export function runTestSearch () {
  const queries = [
    { what: 'nodejs developer', where: 'remote', when: 1 }
    // { what: 'typescript developer', where: 'remote', when: 3 }
  ]

  return scrapeIndeedWithQueries(queries)
}

const res = await runTestSearch()
console.log(`Found ${Object.keys(res).length} postings`)
console.log(res)
