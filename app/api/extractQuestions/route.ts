import { NextRequest, NextResponse } from "next/server";
import { model, dataUrlToInlinePart } from "@/lib/gemini";

const PROMPT = `You are extracting questions from a scanned question paper page.
Return ONLY a JSON array, no markdown, in this shape:
[{ "number": "11", "subpart": "a", "fullLabel": "11(a)", "text": "..." }]
Rules:
- Preserve printed order exactly as it appears.
- Treat labelled sub-parts (a), (b), (i), (ii) etc as SEPARATE entries, each with the parent number and its own subpart.
- If a question has no sub-parts, omit "subpart" or set it to null.
- Do not summarize or shorten question text — transcribe it fully.`;

export async function POST(req: NextRequest) {
  const { pages } = await req.json(); // pages: string[] of base64 data URLs, in order
  const allQuestions = [];

  for (let i = 0; i < pages.length; i++) {
    const result = await model.generateContent([
      PROMPT,
      dataUrlToInlinePart(pages[i]),
    ]);
    const parsed = JSON.parse(result.response.text());
    parsed.forEach((q: any) => allQuestions.push({ ...q, pageIndex: i, id: crypto.randomUUID() }));
  }

  return NextResponse.json({ questions: allQuestions });
}