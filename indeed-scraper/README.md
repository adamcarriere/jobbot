# Indeed Job Search Scraper

A utility that uses [Puppeteer](https://pptr.dev/) to scrape Indeed.ca for job listings.

The library exports a single async function `scrapeIndeedWithQueries` which takes an array of search objects representing your searches. Each search will return a keyed object of search results:

```js
{   
    [id: String]: { // the Indeed jk or sk id
    title: String,
    url: String,
    company: { 
        name: Strings,
        location: String 
    },
    salary: { // if there was a salary on the result card; if not returns null
        range: [Object], 
        rate: 'annually' 
    },
    metadata: Array<String>, // other metadata strings
    snippet: String // the job snippet on the initial result
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