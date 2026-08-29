import { NextResponse } from "next/server";
import { extractAnswers } from "@/lib/ai/extractAnswer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pageImages = body.pageImages;

    if (
      !Array.isArray(pageImages) ||
      pageImages.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Answer sheet pages are required",
        },
        {
          status: 400,
        }
      );
    }

    const answers =
      await extractAnswers(pageImages);

    return NextResponse.json({
      success: true,
      answers,
    });
  } catch (error) {
    console.error(
      "Answer extraction failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to extract answers",
      },
      {
        status: 500,
      }
    );
  }
}