// import scrapeIndeedWithQueries from '../index.js'
import axios from 'axios'

// export function runTestSearch () {
//   const queries = [
//     { what: 'nodejs developer', where: 'remote' }
//     // { what: 'typescript developer', where: 'remote', when: 3 }
//   ]

//   return scrapeIndeedWithQueries(queries)
// }

// const jobSearchResults = await runTestSearch()
axios.post('http://127.0.0.1:5001/job-seeking-robot-6f021/us-central1/addJobListingsForProcessing', {
  params: {
    jobSearchResults: []
  },
  headers: {
    'Content-Type': 'application/json'
  }
}).then(res => {
  console.log(res.data)
})

// console.log(`Found ${Object.keys(jobSearchResults).length} postings`)
// console.log(jobSearchResults)
