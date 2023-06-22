import puppeteer from 'puppeteer'

const args = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
  '--window-position=0,0',
  '--ignore-certifcate-errors',
  '--ignore-certifcate-errors-spki-list',
  '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0"'
]

const getBrowser = async () => await puppeteer.launch({ ignoreDefaultArgs: false, defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 }, args })

export { getBrowser }
