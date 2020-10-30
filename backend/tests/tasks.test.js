require('dotenv').config()
const pup = require('puppeteer')
const mockLogin = require('./mockAuth')

let page

describe('When logged in', () => {
  beforeEach(async () => {
    browser = await pup.launch({ headless: true })
    page = await mockLogin(true, browser)
  })

  afterEach(async () => await browser.close())

  it('shows the add button', async () => { 
    await page.waitForSelector('button[name="new"]') 
    const text = await page.$eval('button[name="new"]', el => el.innerHTML)
    expect(text).toEqual('Add')
  })

  it('shows the task list', async () => { 
    await page.waitForSelector('p[name="list"]') 
    const text = await page.$eval('p[name="list"]', el => el.innerHTML)
    expect(text).toEqual('List')
  })

  describe('And using invalid entries', () => {
    beforeEach(async () => {
      browser = await pup.launch({ headless: true })
      page = await mockLogin(true, browser)
    })

    afterEach(async () => await browser.close())
    
    it('shows warning when submitting empty input', async () => { 
      await page.waitForSelector('button[name="new"]') 
      await page.click('button[name="new"]')
      const text = await page.$eval('p[name="emptyInput"]', el => el.classList)
      expect(Object.values(text).includes('hidden')).toEqual(false)
  
    })
  })
})