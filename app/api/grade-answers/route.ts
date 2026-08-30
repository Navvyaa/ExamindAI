import { NextResponse } from "next/server";
import { gradeResults } from "@/lib/ai/gradeAnswers";
import { AssessmentResult } from "@/types/assessment";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const results: AssessmentResult[] = body.results;

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: "No results provided to grade" },
        { status: 400 }
      );
    }

    const graded = await gradeResults(results);
    console.log("Grading: ",graded);

    return NextResponse.json({ results: graded });
  } catch (error) {
    console.error("Grading failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to grade answers",
      },
      { status: 500 }
    );
  }
}