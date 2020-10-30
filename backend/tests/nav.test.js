require('dotenv').config()
const pup = require('puppeteer')
const mockLogin = require('./mockAuth')

let page, browser

describe('Nav when not logged in', () => {
  beforeEach(async () => {
    browser = await pup.launch({ headless: true })
    page = await mockLogin(false, browser)
  })

  afterEach(async () => await browser.close())

  it('shows the app title', async () => {
    const text = await page.$eval('a', el => el.innerHTML)
    expect(text).toEqual('Tasks Todo')
  })

  it('has a login button', async () => {
    const text = await page.$eval('a[name=login]', el => el.innerHTML)
    expect(text).toEqual('Login')
  })

  it('starts oauth when login clicked', async () => {
    await page.click('a[name=login]')
    const url = page.url()
    expect(url).toMatch(/us\.auth0\.com/)
  })

})

describe('Nav when not logged in', () => {
  beforeEach(async () => {
    browser = await pup.launch({ headless: true })
    page = await mockLogin(true, browser)
  })

  afterEach(async () => await browser.close())

  it('shows logout once signed in', async () => {
    await page.waitForSelector('a[href="http://localhost:3000/api/logout"]') 

    const text = await page.$eval('a[href="http://localhost:3000/api/logout"]', el => el.innerHTML)
    expect(text).toEqual('Logout')
  }) 
})