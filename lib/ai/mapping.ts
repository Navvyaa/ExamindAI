import { model } from "./gemini";
import {
    Question,
    StudentAnswer,
} from "@/types/assessment";

export interface AnswerMapping {
    answerId: string;
    questionId: string | null;
}

interface MappingResponse {
    mappings: AnswerMapping[];
}

export async function mapping(
    questions: Question[],
    answers: StudentAnswer[]
): Promise<AnswerMapping[]> {
    const questionData = questions.map((question) => `
Question ID: ${question.id}
Question Number: ${question.number}
Question Text: ${question.text}
Order: ${question.order}
`).join("\n");

    const answerData = answers.map((answer) => `Answer ID: ${answer.id} Detected Question Label: ${answer.questionNumber ?? "unknown"} Answer Text: ${answer.text}`).join("\n");

    const prompt = `
You are an assessment answer-mapping system.

You are given:

1. Questions extracted from a question paper.
2. Answers extracted from a student's handwritten answer sheet.

Your task is to determine which student answer belongs
to which question.

IMPORTANT:

- The student's detected question label is NOT necessarily
  the actual question number.
- Labels such as "1)", "2)", "3)" may be answer numbering
  or numbering written by the student.
- Do NOT blindly match the detected label to the question number.
- Use the question text, answer content, detected label,
  and ordering/context to determine the best match.
- A question can have no answer.
- An answer can fail to match any question.
- Never invent a question ID.
- Each answer can map to at most one question.
- If there is not enough evidence to confidently map an answer,
  return null for questionId.

QUESTIONS:

${questionData}

STUDENT ANSWERS:

${answerData}

Return ONLY valid JSON in this exact structure:

{
  "mappings": [
    {
      "answerId": "a1",
      "questionId": "q3"
    }
  ]
}
`;

    const result = await model.generateContent([
        {
            text: prompt,
        },
    ]);

    const response = result.response.text();

    const parsed = JSON.parse(response) as MappingResponse;

    return parsed.mappings;
}