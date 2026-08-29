import { NextResponse } from "next/server";
import { extractQuestions } from "@/lib/ai/extractQuestion";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Question paper is required" },
        { status: 400 }
      );
    }

    const questions = await extractQuestions(file);
    console.log(questions)
    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to extract questions",
      },
      { status: 500 }
    );
  }
}