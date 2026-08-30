import { model } from "./gemini";
import { AssessmentResult } from "@/types/assessment";

/*
 * How many question+answer pairs go into a single Gemini call.
 * Bigger = fewer calls (cheaper, faster overall) but a longer prompt
 * per call. 8-10 is a reasonable default for typical answer lengths;
 * lower it if answers are long-form essays, raise it for short ones.
 */
const BATCH_SIZE = 8;

interface GradableItem {
  id: string;
  result: AssessmentResult;
}

interface RawGrade {
  id: string;
  score: number;
  feedback: string;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function buildBatchPrompt(items: GradableItem[]): string {
  const questionsBlock = items
    .map(({ id, result }) => {
      const { question, answer } = result;
      return `
---
id: "${id}"
question number: ${question.number}
maximum marks: ${question.maxMarks}
question text:
"""
${question.text}
"""
student's answer:
"""
${answer!.text}
"""
`;
    })
    .join("\n");

  return `
You are an expert examiner grading multiple student answers from the same paper.

Below is a list of question/answer pairs, each with a unique "id" and its own
maximum marks. Grade EACH one independently.

${questionsBlock}
---

Rules:
1. For each item, award a score as a NUMBER between 0 and that item's maximum marks (inclusive). Half marks are fine if the item's max allows partial credit — never exceed that item's own maximum.
2. Base each score only on the accuracy, completeness, and relevance of that answer to that question. Do not let one item's grading influence another's.
3. Give concise, specific feedback per item (2-4 sentences): what was correct, what was missing or wrong, and why marks were or weren't awarded.
4. Do not be swayed by handwriting quality, spelling, or length alone — grade on content.
5. If an answer is blank, irrelevant, or nonsensical, award 0 and say why.
6. Do not invent facts about a student's answer that are not present in the text provided.
7. Return an entry for EVERY id listed above, in any order — do not skip any.

Return ONLY valid JSON in this exact shape:
{
  "grades": [
    { "id": "<id>", "score": <number>, "feedback": "<string>" }
  ]
}
`;
}

async function gradeBatch(items: GradableItem[]): Promise<Map<string, RawGrade>> {
  const prompt = buildBatchPrompt(items);

  const result = await model.generateContent([{ text: prompt }]);
  const text = result.response.text();
  const parsed = JSON.parse(text);

  const grades: RawGrade[] = Array.isArray(parsed.grades) ? parsed.grades : [];

  const byId = new Map<string, RawGrade>();
  for (const g of grades) {
    if (typeof g.id === "string") {
      byId.set(g.id, {
        id: g.id,
        score: typeof g.score === "number" ? g.score : 0,
        feedback: typeof g.feedback === "string" ? g.feedback : "",
      });
    }
  }

  return byId;
}

/*
 * Grades an already-matched set of AssessmentResults (question + answer
 * pairs produced by buildAssessmentResults, after the /api/map-answers
 * step). Deliberately does NOT re-match by question number itself —
 * the mapping step already owns that logic, so re-deriving matches
 * here would risk disagreeing with it silently.
 *
 * Batches multiple question/answer pairs into a single Gemini call
 * (BATCH_SIZE at a time) instead of one call per question, which cuts
 * both API cost and total latency significantly on longer papers.
 * Batches are processed sequentially to stay within rate limits; if
 * you need it faster and your quota allows it, this loop can be
 * swapped for Promise.all with a concurrency cap.
 */
export async function gradeResults(
  results: AssessmentResult[]
): Promise<AssessmentResult[]> {
  // Results that can't be sent to the model at all: no answer found,
  // or no maxMarks extracted from the question paper. These are
  // resolved immediately with no API call.
  const resolved = new Map<string, AssessmentResult>();
  const gradable: GradableItem[] = [];

  for (const result of results) {
    const { question, answer } = result;
    const key = question.id;

    if (!answer || !answer.text?.trim()) {
      resolved.set(key, {
        ...result,
        score: 0,
        feedback: "No answer was found for this question.",
      });
      continue;
    }

    if (!question.maxMarks || question.maxMarks <= 0) {
      resolved.set(key, {
        ...result,
        score: undefined,
        feedback:
          "Could not grade automatically: no maximum marks were found for this question on the question paper. Please set maxMarks manually.",
      });
      continue;
    }

    gradable.push({ id: key, result });
  }

  // Send the remaining gradable items to Gemini, BATCH_SIZE at a time.
  const batches = chunk(gradable, BATCH_SIZE);

  for (const batch of batches) {
    const grades = await gradeBatch(batch);

    for (const { id, result } of batch) {
      const grade = grades.get(id);
      const maxMarks = result.question.maxMarks;

      if (!grade) {
        // Model didn't return this id — surface it rather than
        // silently defaulting to a score, so it's visibly flagged
        // for manual review instead of looking falsely "graded".
        resolved.set(id, {
          ...result,
          score: undefined,
          feedback:
            "Grading failed for this question (no result returned by the model). Please retry or grade manually.",
        });
        continue;
      }

      const score = Math.max(0, Math.min(grade.score, maxMarks));

      resolved.set(id, {
        ...result,
        score,
        feedback: grade.feedback,
      });
    }
  }

  // Return in the original order.
  return results.map((r) => resolved.get(r.question.id) ?? r);
}