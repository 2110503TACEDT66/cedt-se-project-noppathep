describe('Reserve Restaurant', () => {
    it('TEST01', () => {
        //login
        cy.visit('http://localhost:3000/api/auth/signin')
        cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
        cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
        cy.get('.MuiButtonBase-root').click()
        //reserve food Whalebone
        cy.get('[href="/reservation"]').click()
        cy.get('#location').click()
        cy.get('[data-value="65fda1ee4caa1429bfd0d1ab"]').click()
        cy.get("input[id=':r1:']").type("050120241705")
        cy.get('.bg-teal-600').click()
        cy.get('.swal2-confirm').click()
        cy.get('.swal2-confirm').click()
        cy.get(':nth-child(2) > .topmenu_itemcontainer__xd8j8').click()
        cy.get('.w-full > :nth-child(3)').should('have.text', 'Reservation Date: 01 May 2024 17:05')
    })
    it('TEST02', () => {
        //login
        cy.visit('http://localhost:3000/api/auth/signin')
        cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
        cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
        cy.get('.MuiButtonBase-root').click()
        //reserve food Whalebone
        cy.get('[href="/reservation"]').click()
        cy.get('#location').click()
        cy.get('[data-value="65fda1ee4caa1429bfd0d1ab"]').click()
        cy.get("input[id=':r1:']").type("050420242005")
        cy.get('.bg-teal-600').click()
        cy.get('.swal2-confirm').click()
        cy.get('.swal2-confirm').click()
        cy.get(':nth-child(2) > .topmenu_itemcontainer__xd8j8').click()
        cy.get(':nth-child(2) > .h-full > .w-full > :nth-child(3)').should('have.text', 'Reservation Date: 04 May 2024 20:05')
    })
    it('TEST03', () => {
        //login
        cy.visit('http://localhost:3000/api/auth/signin')
        cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
        cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
        cy.get('.MuiButtonBase-root').click()
        //reserve food Whalebone
        cy.get('[href="/reservation"]').click()
        cy.get('#location').click()
        cy.get('[data-value="65fda1ee4caa1429bfd0d1ab"]').click()
        cy.get("input[id=':r1:']").type("043020241705")
        cy.get('.bg-teal-600').click()
        cy.get('.swal2-confirm').click()
        cy.get('.text-red-700').should('have.text', 'Reservation must be scheduled for a time after today')
    })
    it('Delete 2 Reservation', () => {
        //login
        cy.visit('http://localhost:3000/api/auth/signin')
        cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
        cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
        cy.get('.MuiButtonBase-root').click()
        //Delete 3 Reservation
        cy.get(':nth-child(2) > .topmenu_itemcontainer__xd8j8').click()
        cy.get(':nth-child(1) > .h-full > .w-full > .flex > .bg-red-600').click()
        cy.get('.swal2-confirm').click()
        cy.get(':nth-child(1) > .h-full > .w-full > .flex > .bg-red-600').click()
        cy.get('.swal2-confirm').click()
    })
    it('TEST04', () => {
        //login
        cy.visit('http://localhost:3000/api/auth/signin')
        cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
        cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
        cy.get('.MuiButtonBase-root').click()
        //reserve food Whalebone
        cy.get('[href="/reservation"]').click()
        cy.get('#location').click()
        cy.get('[data-value="65fda1ee4caa1429bfd0d1ab"]').click()
        cy.get("input[id=':r1:']").type("042920241705")
        cy.get('.bg-teal-600').click()
        cy.get('.swal2-confirm').click()
        cy.get('.text-red-700').should('have.text', 'Reservation must be scheduled for a time after today')
    })
    it('TEST05', () => {
        //login
        cy.visit('http://localhost:3000/api/auth/signin')
        cy.get("input[id=':R1qqqqqkq:']").type('lastest@gmail.com')
        cy.get('input[id=":R2aqqqqkq:"]').type("lastest")
        cy.get('.MuiButtonBase-root').click()
        //reserve food Whalebone
        cy.get('[href="/reservation"]').click()
        cy.get('#location').click()
        cy.get('[data-value="65fda1ee4caa1429bfd0d1ab"]').click()
        cy.get("input[id=':r1:']").type("050320242400")
        cy.get('.bg-teal-600').click()
        cy.get('.swal2-confirm').click()
        cy.get('.text-red-700').should('have.text', 'Reservation must be within restaurant opening hours')
    })
    it('TEST06', () => {
        //No login
        //reserve food Whalebone
        cy.visit('http://localhost:3000')
        cy.get('[href="/reservation"]').should('not.exist')
    })
    it('TEST07', () => {
        //login as owner
        cy.visit('http://localhost:3000/api/auth/signin')
        cy.get("input[id=':R1qqqqqkq:']").type('whalebone@gmail.com')
        cy.get('input[id=":R2aqqqqkq:"]').type("123456")
        cy.get('.MuiButtonBase-root').click()
        //reserve food Whalebone
        cy.get('[href="/reservation"]').should('not.exist')
    })
    it('TEST08', () => {
        //login as Admin
        cy.visit('http://localhost:3000/api/auth/signin')
        cy.get("input[id=':R1qqqqqkq:']").type('whale@gmail.com')
        cy.get('input[id=":R2aqqqqkq:"]').type("whales")
        cy.get('.MuiButtonBase-root').click()
        //reserve food Whalebone
        cy.get('[href="/reservation"]').should('not.exist')
    })
  })