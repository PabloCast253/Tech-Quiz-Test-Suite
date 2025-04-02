/// <reference types="cypress" />

import Quiz from '../../client/src/components/Quiz';
import { mount } from '@cypress/react18';

// Simulated network delay helper
const delay = (/** @type {number | undefined} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock questions
const mockQuestions = [
  {
    _id: 'q1',
    question: 'What is React?',
    answers: [
      { text: 'A library for building UI', isCorrect: true },
      { text: 'A backend framework', isCorrect: false },
      { text: 'A database', isCorrect: false },
    ],
  },
  {
    _id: 'q2',
    question: 'What is JSX?',
    answers: [
      { text: 'JavaScript XML', isCorrect: true },
      { text: 'A server', isCorrect: false },
      { text: 'A CSS extension', isCorrect: false },
    ],
  },
  {
    _id: 'q3',
    question: 'What is JavaScript?',
    answers: [
      { text: 'A programming language', isCorrect: true },
      { text: 'A database', isCorrect: false },
      { text: 'A CSS framework', isCorrect: false },
    ],
  },
];

describe('<Quiz /> Component', () => {
  beforeEach(() => {
    const root = document.querySelector('[data-cy-root]');
    if (root) root.innerHTML = '';

    // Return mount to make Cypress wait for it
    return mount(
      <Quiz
        getQuestionsOverride={async () => {
          await delay(300); // simulate API delay
          return mockQuestions;
        }}
      />
    );
  });

  it('renders the start screen', () => {
    cy.contains('Start Quiz').should('be.visible');
  });

  it('starts quiz and shows first question', () => {
    cy.contains('Start Quiz').click();

    cy.get('body').then(($body) => {
      if ($body.find('.spinner-border').length > 0) {
        cy.get('.spinner-border').should('not.exist');
      }

      cy.contains(mockQuestions[0].question, { timeout: 6000 }).should('be.visible');
    });
  });

  it('selects an answer and moves to next question', () => {
    cy.contains('Start Quiz').click();

    cy.get('body').then(($body) => {
      if ($body.find('.spinner-border').length > 0) {
        cy.get('.spinner-border').should('not.exist');
      }

      cy.contains(mockQuestions[0].question).should('be.visible');

      cy.contains(mockQuestions[0].answers[0].text)
        .should('be.visible')
        .prev('button')
        .click();

      cy.contains(mockQuestions[1].question).should('be.visible');
    });
  });

  it('completes quiz and shows score', () => {
    cy.contains('Start Quiz').click();

    cy.get('body').then(async ($body) => {
      if ($body.find('.spinner-border').length > 0) {
        cy.get('.spinner-border').should('not.exist');
      }

      for (let i = 0; i < mockQuestions.length; i++) {
        const current = mockQuestions[i];
        const next = mockQuestions[i + 1];

        cy.contains(current.question, { timeout: 5000 }).should('be.visible');
        cy.contains(current.answers[0].text)
          .should('be.visible')
          .prev('button')
          .click();

        if (next) {
          cy.contains(next.question).should('be.visible');
        }
      }

      cy.contains('Quiz Completed', { timeout: 5000 }).should('be.visible');
      cy.contains('Your score:').should('be.visible');
    });
  });
});
