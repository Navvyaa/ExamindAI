import { model } from "../gemini";

export interface ExtractedAnswer {
  id: string;
  questionNumber: string | null;
  text: string;
  regions: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}

interface ExtractionResponse {
  answers: ExtractedAnswer[];
}

export async function extractAnswers(
  pageImages: string[]
): Promise<ExtractedAnswer[]> {
  const imageParts = pageImages.map((image) => {
    const [meta, data] = image.split(",");

    const mimeType =
      meta.match(/data:(.*);base64/)?.[1] ??
      "image/png";

    return {
      inlineData: {
        mimeType,
        data,
      },
    };
  });

  const prompt = `
You are an expert handwritten answer-sheet analysis system.

The attached images are pages from ONE student's handwritten
answer sheet.

Your task is to identify EVERY answer written by the student.

For each answer, determine:

1. Which question the answer belongs to.
2. The text/content of the answer.
3. The exact region(s) of the page containing that answer.

IMPORTANT RULES:

1. Answers may be written out of order.

2. Preserve the question number written by the student.

Examples:

3
11(a)
11(b)
5(c)

3. If the student has answered a question across multiple pages,return multiple regions for that answer.

4. If you can see an answer but cannot determine which question it belongs to, set questionNumber to null.

5. Do NOT invent question numbers.

6. Do NOT combine answers to different questions.

7. Handwritten text should be transcribed as accurately as possible.

8. Include the entire answer, not just the first few lines.

9. Ignore decorative marks, page numbers, signatures and unrelated writing.

10. For every answer, return the bounding region containing the handwritten answer.

11. Coordinates must be relative to the ORIGINAL IMAGE.

12. The coordinate origin is the TOP-LEFT corner.

13. x increases from left to right.

14. y increases from top to bottom.

15. If an answer spans multiple disconnected regions or pages, return each region separately.

16. Page numbers start at 1.

Return ONLY valid JSON in this structure:

{
  "answers": [
    {
      "id": "a1",
      "questionNumber": "3",
      "text": "transcribed answer...",
      "regions": [
        {
          "page": 1,
          "x": 120,
          "y": 350,
          "width": 700,
          "height": 250
        }
      ]
    }
  ]
}
`;

  const result = await model.generateContent([
    {
      text: prompt,
    },
    ...imageParts,
  ]);

  const response = result.response.text();

  const parsed =
    JSON.parse(response) as ExtractionResponse;

  return parsed.answers;
}