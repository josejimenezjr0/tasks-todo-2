require('dotenv').config()
const pup = require('puppeteer')

module.exports = async (login, browser) => {
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/')
  if(login) {
    await page.setCookie({ name: 'express:sess.sig', value: process.env.AUTH_SIG })
    await page.setCookie({ name: 'express:sess', value: process.env.AUTH_COOKIE })
    await page.goto('http://localhost:3000/')
  }

  return page
}