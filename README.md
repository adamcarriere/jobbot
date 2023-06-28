# Jobbot - Searching Indeed for jobs so you don't have to

Job searching is hard.

Jobbot is a Node.js application that automates your job search (on [Indeed.ca](https://indeed.ca)) by running your searches for you and then asking [ChatGPT](https://openai.com/blog/chatgpt) to summarize and assess the job against your resume and career goals, and then sends that to your Job Searching [Trello board](https://trello.com/).

# Prerequisites

1. Node.js v18.16.0
2. An OpenAI api key
3. A Trello API key and token

# Installation

1. Clone this repo to your local environment
2. Run `npm i` to install dependencies

# Setting up the config files

Jobbbot requires a few different configuration files in order to run.

Examples of the required files can be found in `./config-samples`.

```
/config
  .config.yaml
  interests.txt
  resume.txt
  trello.config.yaml
```
## `.config.yaml`

```yaml
DATAPATH: './data.json' # path to the file that will be created to store the postings you've searched
OPENAI_KEY: [YOUR_OPEN_AI_KEY]
TRELLOAPI_TOKEN: [YOUR_TRELLO_API_TOKEN]
TRELLOAPI_KEY: [YOUR_TRELLO_API_KEY]

# the queries that will be searched on Indeed
queries:
  - what: 'Frontend Developer: TypeScript, JavaScript, HTML, CSS, Vue.js, React.js'
    where: remote
    when: 3
  - what: 'Full Stack Developer: TypeScript, JavaScript, HTML, CSS, Node.js, Python'
    where: remote
    when: 3
  - what: 'Senior Software Developer: TypeScript, JavaScript, HTML, CSS, Node.js, Python'
    where: remote
    when: 3
```
### Queries

The queries for Jobbot are an object with a `what`, `where`, and `when` property:

- `what`: the job you're searching; the string you would enter into the search bar
- `where`: the location you're searching in; the string you would enter into the location search bar
- `when`: how far back to look; `1`, `3`, `7`, or `14` days. Leaving this out will search all listings for the `what` param (this could return hundreds of results)

## `interests.txt`

This is the file where you will store your career goals.

In order to reduce the number of tokens you'll send to the OpenAI api, it is recommended you run the `util/compress` script from `npm` and use that output. This will run an algoritm that will reduce the text to the most important tokens while still maintaining relevance for the GPT.

For example, taking the sample `_interests.txt` file:

```
Highly interested:
Remote work
health benefits
4-day work-week
unlimited paid time off

More interested:
webapps
product development
freelance contracts
professional growth

interested:
Typescript/Javascript
Frontend development
Video games

Less interested:
Slot machines

Not interested:
FORTRAN
```

we run `npm run util/compress -- ./config-samples/_interests.txt ./config/interests.txt' and get this:

```
highli interest remot work health benefit dai work week unlimit paid time off interest webapp product develop freelanc contract profession growth interest typescript javascript frontend develop video game less interest slot machin not interest fortran
```
## `resume.txt`

This is the file where you will store your resume/CV.

Again, it is recommended you run your full format resume through `util/compress` to minimize the tokens.

## `trello.config.yaml`

This config file is the specific configuration for the Trello board you want to send your job posts to.

### `util/init-board`

The `npm` script `util/init-board` will do the following:

1. Using the Trello API, create a new Trello Board and populate it with the lists and labels Jobbot uses.
2. Generate a `trello.config.yaml` file for the newly created board

```shell
$ npm run util/init-board -- [name of new board] [trello username]
```
Then, move the generated `trello.config.yaml` file into the `config` directory.

# Performing your searches

Once you've filled in your config files with the api keys, trello board information, interests, resume, and searches, simply run:

```shell
$ npm start
```
This will perform each of your searches.

Each search does the following:

1. Performs the search on Indeed.ca
2. Collects the information for each job found on the search results pages for that search
3. Filters out any jobs that have already been searched and processed by Jobbot (stored in the data-store; `data.json`)
4. Gets the full post for each job
5. Performs a pre-screening by removing French language text (I'm in Quebec, so that's a biggy)
6. Compresses the job listing
7. Compares the listing with your resume and interests with ChatGPT
8. Creates a new card on your Trello board with a summary and the results of the analysis for you to review and apply!

# Known limitations

## 1. Running the script takes a LONG time; especially the first run

Running the script from start to finish can take a long time, upwards of 20+ minutes if there are a lot of searches and results.

This is due to the number of Puppeteer (Chromium) instances that run for each search. The more queries you have, the more instances. To avoid your CPU melting, searches are done one after the other.

A major contributing factor to the runtime duration of the script is OpenAI's limitation on api calls to *3/min* for the free tier. This means we can only send a call to the api once every 20 seconds.

> NOTE: Switching to a pay-as-you-go plan would change this limit to up to 3,500 RPM

Additionally, the response time of the api can also be upwards of 20 seconds per request. 

## 2. The ChatGPT API (OpenAI API) limitations and costs can become prohibitive

As mentioned, the request limits and response times of the ChatGPT API contribute to the runtime duration.

The usage of the ChatGPT also comes at a cost; the current cost is `$0.003 / 1,000 tokens`.

For my first run, I sent 62 listings to the api. Here are the token counts for that run:

```
Listings: 62
Total tokens: 99095
Average: 1599
```
This results in the following cost breakdown:

```
Total cost: $0.297285
Avg cost per request: $0.004797
```

Which, really, doesn't seem that high. However, if you're relying solely on the free-tier (like me), you're limited to the free $5 trial dollars. This means that you can only make a similarly sized search ~16 times ($5.00 / $0.297285 per run).

Realisticly, you would only get this many results in the first run (or if you delete your `data.json` file), and you can optimize this by doing fewer queries per run.

Regardless, this is still a limitation if you don't want to pay for more API access.

## 3. ChatGPT responses can be inconsistent

ChatGPT isn't very deterministic; you may get a different result for the same input. You could play with the `temperature` option (and others) in the `./src/process-results.js` file, but at the moment the options are set to default.

For this reason, it is recommended that you review all the cards added to your board thoroughly before applying and why there's no "auto apply" mechanism. 

# License

GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
