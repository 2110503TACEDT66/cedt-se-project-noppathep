describe('Rating and Comment', () => {
    // it('TEST01', () => {
    //     //login
    //     cy.visit('http://localhost:3000/api/auth/signin')
    //     cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
    //     cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
    //     cy.get('.MuiButtonBase-root').click()
    //     //reserve food Whalebone
    //     cy.get('[href="/reservation"]').click()
    //     cy.get('#location').click()
    //     cy.get('[data-value="65fda132323b9f5b9ef7540c"]').click()
    //     cy.get("input[id=':r1:']").type("050120241705")
    //     cy.get('.bg-teal-600').click()
    //     cy.get('.swal2-confirm').click()
    //     cy.get('.swal2-confirm').click()
    //     cy.get(':nth-child(2) > .topmenu_itemcontainer__xd8j8').click()
    //     cy.get('.w-full > :nth-child(3)').should('have.text', 'Reservation Date: 01 May 2024 17:05')
    //     cy.get('.bg-green-600').click()
    //     cy.get('.swal2-confirm').click()
    //     cy.get('.swal2-confirm').click()
    //     //Rating
    //     cy.get('.bg-yellow-500').click()
    //     cy.get('[for=":r3:"]').click()
    //     //View score
    //     cy.get('.bg-emerald-500').click()
    //     cy.get(':nth-child(2) > .topmenu_itemcontainer__xd8j8').click()
    //     cy.get('.bg-yellow-500').click()
    //     cy.get('.swal2-popup').should('have.text', '×iYour Rating CommentYou rated 3 stars and says: CloseNoCancel')
    //     cy.get('.swal2-confirm').click()
    //     cy.get('.bg-red-600').click()
    //     cy.get('.swal2-confirm').click()
    // })
    it('TEST02', () => {
        //login
        cy.visit('http://localhost:3000/api/auth/signin')
        cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
        cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
        cy.get('.MuiButtonBase-root').click()
        //reserve food Whalebone
        cy.get('[href="/reservation"]').click()
        cy.get('#location').click()
        cy.get('[data-value="65fda132323b9f5b9ef7540c"]').click()
        cy.get("input[id=':r1:']").type("050120241705")
        cy.get('.bg-teal-600').click()
        cy.get('.swal2-confirm').click()
        cy.get('.swal2-confirm').click()
        cy.get(':nth-child(2) > .topmenu_itemcontainer__xd8j8').click()
        cy.get('.w-full > :nth-child(3)').should('have.text', 'Reservation Date: 01 May 2024 17:05')
        cy.get('.bg-green-600').click()
        cy.get('.swal2-confirm').click()
        cy.get('.swal2-confirm').click()
        //Rating
        cy.get('.bg-yellow-500').click()
        cy.get('[for=":r5:"]').click()
        cy.get('.h-40').type('good Restaurent')
        //View score
        cy.get('.bg-emerald-500').click()
        cy.get(':nth-child(2) > .topmenu_itemcontainer__xd8j8').click()
        cy.get('.bg-yellow-500').click()
        cy.get('.swal2-popup').should('have.text', '×iYour Rating CommentYou rated 5 stars and says:good Restaurent CloseNoCancel')
        cy.get('.swal2-confirm').click()
        cy.get('.bg-red-600').click()
        cy.get('.swal2-confirm').click()
    })
  })