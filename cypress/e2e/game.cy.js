beforeEach(() => {
  cy.viewport(1440, 900)
  cy.visit('http://localhost:5000')
})

describe('Welcome Modal', () => {
  it('Has a welcome message with directions', () => {
    cy.get('.modal').should('be.visible')
    cy.get('.modal .content').should('contain', 'OBJECTIVE:')
    cy.get('.modal .content').should('contain', 'BUDGET:')
    cy.get('.modal .content').should('contain', 'Use your keyboard to control the thrust and angle parameters')
    cy.get('.modal button.accept')
      .should('be.visible')
      .click()
    cy.get('.modal').should('not.exist')
  })
})

describe('Game', () => {
  beforeEach(() => {
    // close the welcome modal
    cy.get('.modal button.accept').should('be.visible').click()
  })

  it('Launching the rocket increments the attempts and cost counters', () => {
    cy.get('#write-attempts').should('have.text', '0')
    cy.get('#write-cost').should('have.text', '0')
    
    cy.get('#launch')
      .should('be.visible')
      .click()
      cy.wait(1000)
      
    cy.get('#write-attempts').should('have.text', '1')
    cy.get('#write-cost').should('have.text', '385,491,676')
    
    cy.get('body').type(' ')
    cy.wait(1000)
    
    cy.get('#write-attempts').should('have.text', '2')
    cy.get('#write-cost').should('have.text', '770,983,352')
  })

  describe('Thrust', () => {
    it('You can adjust the thrust with controls', () => {
      cy.get('#thrust').invoke('val').then((value) => {
        cy.get('#thrust-inc').click()
        cy.get('#thrust').should('have.value', +value + 1)
        cy.get('#thrust-dec').click()
        cy.get('#thrust').should('have.value', value)
        cy.get('#thrust-dec').click()
        cy.get('#thrust').should('have.value', +value - 1)
      })
    })

    it('You can adjust the thrust with keyboard', () => {
      cy.get('#thrust').invoke('val').then((value) => {
        cy.get('body').type('w')
        cy.get('#thrust').should('have.value', +value + 1)
        cy.get('body').type('s')
        cy.get('#thrust').should('have.value', value)
        cy.get('body').type('s')
        cy.get('#thrust').should('have.value', +value - 1)
      })
    })
  })

  describe('Angle', () => {
    it('You can adjust the angle with keyboard', () => {
      cy.get('#angle').invoke('val').then((value) => {
        cy.get('body').type('d')
        cy.get('#angle').should('have.value', +value + 1)
        cy.get('body').type('a')
        cy.get('#angle').should('have.value', value)
        cy.get('body').type('a')
        cy.get('#angle').should('have.value', +value - 1)
      })
    })
  })

  it('You can land the rocket on the moon, and it shows the finishing message', () => {
    // Set up angle
    cy.get('body').type('a')
    cy.get('#angle').should('have.value', 4)
    
    // Set up thrust
    cy.get('body')
      .type('w').type('w').type('w').type('w').type('w')
      .type('w').type('w').type('w').type('w').type('w')
      .type('w').type('w').type('w').type('w').type('w')
    cy.get('#thrust').should('have.value', 30)

    cy.get('#launch').click()
    cy.wait(2500)

    cy.get('#launch').click()
    cy.wait(2500)

    cy.get('.modal').should('be.visible')
    cy.get('.modal h1').should('have.text', 'You did it!')
    cy.get('.modal .content').should('contain', 'It took you 2 tries to make it')
    cy.get('.modal .content').should('contain', 'You spent a total of $1,248,955,119')
    cy.get('.modal button.accept').click()
    cy.get('.modal').should('not.exist')

    // Game resets:
    cy.get('#write-attempts').should('have.text', '0')
    cy.get('#write-cost').should('have.text', '0')
  })

  it('If you go over the budget, you are asked to play again', () => {
    // Waste fuel to go over budget
    cy.get('body')
      .type('a').type('a').type('a').type('a').type('a')
      .type('s').type('s').type('s').type('s').type('s')
      .type('s').type('s').type('s').type('s').type('s')
      .type('s').type('s').type('s').type('s')
      .type(' ').type(' ').type(' ').type(' ').type(' ')
      .type(' ').type(' ').type(' ').type(' ').type(' ')
      .type(' ').type(' ').type(' ').type(' ').type(' ')
      .type(' ').type(' ').type(' ').type(' ').type(' ')
      .type(' ').type(' ').type(' ').type(' ').type(' ')
      .type(' ').type(' ').type(' ').type(' ').type(' ')
      .type(' ').type(' ').type(' ').type(' ').type(' ')
      .type(' ').type(' ').type(' ').type(' ').type(' ')
      .type(' ').type(' ').type(' ').type(' ').type(' ')
    cy.get('#angle').should('have.value', 0)
    cy.get('#thrust').should('have.value', 1)
    
    
    // Set up angle
    cy.get('body')
      .type('d').type('d').type('d').type('d')
    cy.get('#angle').should('have.value', 4)
    
    // Set up thrust
    cy.get('body')
      .type('w').type('w').type('w').type('w').type('w')
      .type('w').type('w').type('w').type('w').type('w')
      .type('w').type('w').type('w').type('w').type('w')
      .type('w').type('w').type('w').type('w').type('w')
      .type('w').type('w').type('w').type('w').type('w')
      .type('w').type('w').type('w').type('w')
    cy.get('#thrust').should('have.value', 30)

    cy.get('#launch').click()
    cy.wait(2500)

    cy.get('#launch').click()
    cy.wait(2500)

    cy.get('.modal').should('be.visible')
    cy.get('.modal h1').should('have.text', 'Not quite there yet...')
    cy.get('.modal .content').should('contain', 'It took you 25 tries to make it')
    cy.get('.modal .content').should('contain', 'You spent a total of $3,350,124,811')
    cy.get('.modal .content').should('contain', 'try again')
    cy.get('.modal button.accept').click()
    cy.get('.modal').should('not.exist')

    // Game resets:
    cy.get('#write-attempts').should('have.text', '0')
    cy.get('#write-cost').should('have.text', '0')
  })
})