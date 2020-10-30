require('dotenv').config()

describe('Nav when not logged in', () => {
  it('shows the app title', () => {
    cy.visit('/')
    cy.get('a').contains('Tasks Todo')
  })

  it('has a login button', () => {
    cy.get('a[name=login]').contains('Login')
  })

  it('starts oauth when login clicked', () => {
    cy.get('a[name=login]').click()
    cy.url().should('include', 'us.auth0.com')
  })
})

describe('Nav when logged in', () => {
  it('shows logout once signed in', () => {
    cy.visit('/')
    cy.get('a[name=login]').click()
    cy.wait(500)
    cy.get('input[name=email]').type(Cypress.env('auth_username'))
    cy.get('input[name=password]').type(Cypress.env('auth_password'))
    cy.get('button[name=submit]').click()
    cy.wait(500)
    cy.get('a[name=logout]').contains('Logout').click()
  }) 
})