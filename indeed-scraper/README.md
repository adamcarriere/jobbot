# Indeed Job Search Scraper

A utility that uses [Puppeteer](https://pptr.dev/) to scrape Indeed.ca for jobs.

The library exports a single async function `scrapeIndeedWithQueries` which takes an array of objects representing your searches. Each search will be executed in a puppeteer browser instance concurrently and will return an object with the following shape:

```js
{   
    // the id of the job posting on Indeed
    [id: String]: {
        title: String // the job title in the posting
        url: String // link to the job posting
        company: {
            name: String // name of the company who posted it
            link: String // link to their Indeed profile
        }
        description: String // contents of the job posting
        salary: String | undefined // salary if detectable
    }
}
```

## Usage

`scrapeIndeedWithQueries` accepts an array of objects with the following shape:

```js
{
    what: String // the job title you are searching for
    where: String // the location the job is in
    when: undefined | 1 | 3 | 7 | 14 // the "date posted" filter
}
```

Example:

```js
import scrapeIndeedWithQueries from 'indeed-scraper'
// import scrapeIndeedWithQueries from './index.js'

const queries = [
    { what: 'nodejs developer', where: 'remote' },
    { what: 'typescript developer', where: 'Montreal', when: 3 }
]

const jobs = await scrapeIndeedWithQueries(queries)
```

### Salary

To include a salary range you can append it to the `what` property in your query objects.

Example, if you want to search for salaries $100k+:
```js
const what = 'nodejs developer $100k+'
const query = {what, where, when}
```