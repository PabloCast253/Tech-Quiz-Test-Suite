/// <reference types="cypress" />

import Quiz from '../../client/src/components/Quiz'; // Adjust path if needed
import { mount } from '@cypress/react18'; // 👈 Use this if you're using React 18

// Mock questions to simulate API response
const mockQuestions = [
  {
    _id: "q1",
    question: "What is React?",
    answers: [
      { text: "A library for building UI", isCorrect: true },
      { text: "A backend framework", isCorrect: false },
      { text: "A database", isCorrect: false },
    ],
  },
  {
    _id: "q2",
    question: "What is JSX?",
    answers: [
      { text: "JavaScript XML", isCorrect: true },
      { text: "A server", isCorrect: false },
      { text: "A CSS extension", isCorrect: false },
    ],
  },
];

describe('<Quiz /> Component', () => {
  beforeEach(() => {
    mount(<Quiz getQuestionsOverride={() => Promise.resolve(mockQuestions)} />);
  });

  it('renders the start screen', () => {
    cy.contains('Start Quiz').should('be.visible');
  });

  it('starts quiz and shows first question', () => {
    cy.contains('Start Quiz').click();
    cy.get('h2').should('contain.text', mockQuestions[0].question);
  });

  it('selects an answer and moves to next question', () => {
    cy.contains('Start Quiz').click();
    cy.get('h2').should('contain.text', mockQuestions[0].question);
    cy.contains(mockQuestions[0].answers[0].text).should('be.visible').prev('button').click();
    cy.get('h2').should('contain.text', mockQuestions[1].question);
  });

  it('completes quiz and shows score', () => {
    cy.contains('Start Quiz').click();

    mockQuestions.forEach((q) => {
      cy.get('h2').should('contain.text', q.question);
      cy.contains(q.answers[0].text).should('be.visible').prev('button').click();
    });

    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score:').should('be.visible');
  });
});
