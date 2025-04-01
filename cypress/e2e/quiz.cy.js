/// <reference types="cypress" />

describe('Tech Quiz App (E2E)', () => {
    beforeEach(() => {
      // Adjust URL if your frontend runs on a different port
      cy.visit('http://localhost:3000');
    });
  
    it('allows a user to take a quiz and see the final score', () => {
      cy.contains('Start Quiz').click();
  
      // Answer all 10 questions — just click the first option each time
      for (let i = 0; i < 10; i++) {
        cy.get('.btn-primary').first().click();
      }
  
      cy.contains('Quiz Completed').should('be.visible');
      cy.contains('Your score:').should('be.visible');
  
      // Restart quiz
      cy.contains('Take New Quiz').click();

// Verify that the first question of the new quiz appears
cy.get('h2').should('exist');
    });
  });
  