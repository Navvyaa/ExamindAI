import { model } from "./gemini";

export async function extractQuestions(file: File) {
  const buffer = await file.arrayBuffer();

  const base64 = Buffer.from(buffer).toString("base64");

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: file.type,
        data: base64,
      },
    },
    {
      text: `
You are an expert question-paper extraction system.
Extract EVERY question from this question paper.
Rules:
1. Preserve the original printed order.
2. Preserve the original question numbering exactly.
3. Treat labelled sub-parts as separate questions.
For example:
11(a)
11(b)
must become two separate questions.
4. Do not merge sub-parts.
5. Do not skip questions.
6. Include the complete question text.
7. If a question continues onto another page,combine it into one question.
8. Do not treat section headings as questions.
9. Do not treat instructions as questions.
10. Do not include marks in the question text.
11. Do not invent missing text.
12. "order" starts at 1 and represents printed order.
13. "page" is the page where the question begins.
14. "maxMarks" is the marks allotted to that question/sub-part, extracted as a number from wherever it is printed (e.g. "[5]", "(10 marks)", "5M", a marks column, etc).
15. If a sub-part has its own marks printed (e.g. 11(a) = 5, 11(b) = 5), assign each sub-part its own maxMarks — do not split a parent question's total evenly.
16. If marks are genuinely not printed anywhere for a question, set "maxMarks" to null. Do not guess or default to a value.

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "number": "1",
      "text": "...",
      "order": 1,
      "page": 1,
      "maxMarks":1
    }
  ]
}
`,
    },
  ]);

  const text = result.response.text();

  const parsed = JSON.parse(text);

  return parsed.questions;
}