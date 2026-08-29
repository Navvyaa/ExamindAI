import {
  Question,
  StudentAnswer,
} from "@/types/assessment";

export function getAssessmentStats(
  questions: Question[],
  answers: StudentAnswer[]
) {
  const answerNumbers = new Set(
    answers
      .map((answer) => answer.questionNumber)
      .filter(Boolean)
  );

  const answeredQuestions = questions.filter(
    (question) =>
      answerNumbers.has(question.number)
  );

  const unansweredQuestions = questions.filter(
    (question) =>
      !answerNumbers.has(question.number)
  );

  const questionNumbers = new Set(
    questions.map((question) => question.number)
  );

  const unmatchedAnswers = answers.filter(
    (answer) =>
      !answer.questionNumber ||
      !questionNumbers.has(answer.questionNumber)
  );

  return {
    total: questions.length,
    answered: answeredQuestions.length,
    unanswered: unansweredQuestions.length,
    unmatched: unmatchedAnswers.length,

    answeredQuestions,
    unansweredQuestions,
    unmatchedAnswers,
  };
}