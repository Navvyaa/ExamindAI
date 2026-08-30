import {
  Question,
  StudentAnswer,
  AssessmentResult,
} from "@/types/assessment";

import { AnswerMapping } from "@/lib/ai/mapping";

export function buildAssessmentResults(
  questions: Question[],
  answers: StudentAnswer[],
  mappings: AnswerMapping[]
): AssessmentResult[] {
  const answerMap = new Map<string, StudentAnswer>();

  for (const mapping of mappings) {
    if (!mapping.questionId) {
      continue;
    }

    const answer = answers.find(
      (answer) =>
        answer.id === mapping.answerId
    );

    if (!answer) {
      continue;
    }

    answerMap.set(
      mapping.questionId,
      answer
    );
  }

  return questions.map((question) => ({
    question,
    answer:
      answerMap.get(question.id) ?? null,
  }));
}