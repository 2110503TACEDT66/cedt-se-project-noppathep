describe('Credit Card Form Submission', () => {
  it('Add card', () => {
    cy.visit('http://localhost:3000/api/auth/signin')
    cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
    cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
    cy.get('.MuiButtonBase-root').click()
    cy.get(':nth-child(2) > .topmenu_itemcontainer__xd8j8').click()
    cy.get(':nth-child(5) > :nth-child(2) > .w-fit').click()
    cy.get('.add-new-card').click()
    cy.get('.card-form__inner > :nth-child(1) > .card-input__input').type("1111111111111111")
    cy.get(':nth-child(2) > .card-input__input').type("John")
    cy.get('[name="cardMonth"]').select("05")
    cy.get('[name="cardYear"]').select("2030")
    cy.get('.-cvv > .card-input > .card-input__input').type("1234")
    cy.get('.bg-gradient-to-r').click()
  })
  it('Delete card', () => {
    cy.visit('http://localhost:3000/api/auth/signin')
    cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
    cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
    cy.get('.MuiButtonBase-root').click()
    cy.get(':nth-child(2) > .topmenu_itemcontainer__xd8j8').click()
    cy.get(':nth-child(5) > :nth-child(2) > .w-fit').click()
    cy.wait(3000)
    cy.get('.card-item__wrapper').click()
    cy.wait(2500) 
    cy.get('a > .d-grid > .btn').wait(1000).click()
    cy.wait(2500)
  })
})