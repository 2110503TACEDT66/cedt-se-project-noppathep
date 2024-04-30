/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('User story 1-4', () => {
    beforeEach(() => {
      //start at home page
      cy.visit('http://localhost:3000')




    })
  
    it('should successfully add new restaurant', () => {

      //click on sign-in link and navigate to /signin page
      cy.get('a').contains('Sign-in').click();
      cy.location('pathname').should('include', 'api/auth/signin');
      
      //fill in email&password
      cy.get('input[type="email"]').type('ownertest@gmail.com')
      cy.get('input[type="email"]').should('have.value','ownertest@gmail.com')
      cy.get('input[type="password"]').type('0123456')
      cy.get('input[type="password"]').should('have.value','0123456')
      
      cy.get('button').contains('Login').click();
      cy.location('pathname').should('include', '');

      //navigate to add restaurant page
      cy.get('a').contains('My Restaurant').click();
      cy.location('pathname').should('include', 'myrestaurant');
      cy.get('a[href="/addRestaurant"]').click();
      cy.location('pathname').should('include', 'addRestaurant');


      //fill in the form
      cy.get('input[name="name"]').type('Cypress Restaurant')
      cy.get('input[name="name"]').should('have.value','Cypress Restaurant')

      cy.get('input[name="district"]').type('Cypress district')
      cy.get('input[name="district"]').should('have.value','Cypress district')

      cy.get('input[name="province"]').type('Cypress province')
      cy.get('input[name="province"]').should('have.value','Cypress province')

      cy.get('input[name="postalcode"]').type('10160')
      cy.get('input[name="postalcode"]').should('have.value','10160')

      cy.get('input[name="region"]').type('Cypress region')
      cy.get('input[name="region"]').should('have.value','Cypress region')

      cy.get('input[name="tel"]').type('012345678')
      cy.get('input[name="tel"]').should('have.value','012345678')

      cy.get('label').contains('Open').next().children().first().type('08:30')
      cy.get('label').contains('Open').next().children().first().should('have.value','08:30')

      cy.get('label').contains('Close').next().children().first().type('16:00')
      cy.get('label').contains('Close').next().children().first().should('have.value','16:00')
    

      //submit
      cy.get('button').contains('Add New Restaurant').click();
      cy.wait(1000)
      //should redirect back to myrestaurant page
      cy.location('pathname').should('include', 'myrestaurant');
      cy.get('a').contains('Cypress Restaurant')

      
      //remove restaurant we just created
      cy.get('a').contains('Cypress Restaurant')
        .parent().parent()
        .find('div').contains('button','Delete').click();

      cy.get('button').contains('Sure, delete it').click();

    })

  
    it('should fail to access add restaurant page', () => {

      //click on sign-in link and navigate to /signin page
      cy.get('a').contains('Sign-in').click();
      cy.location('pathname').should('include', 'api/auth/signin');
      
      //fill in email&password
      cy.get('input[type="email"]').type('usertest@gmail.com')
      cy.get('input[type="email"]').should('have.value','usertest@gmail.com')
      cy.get('input[type="password"]').type('123456')
      cy.get('input[type="password"]').should('have.value','123456')

      cy.get('button').contains('Login').click();
      cy.location('pathname').should('include', '');

      //won't see My Restaurant button
      cy.get('button').contains('My Restaurant').should('not.exist')

    })


  })
  