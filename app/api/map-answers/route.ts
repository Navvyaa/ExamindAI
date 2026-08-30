import { NextResponse } from "next/server";
import { mapping } from "@/lib/ai/mapping";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { questions, answers } = body;
        if (!Array.isArray(questions) || !Array.isArray(answers)) {
            return NextResponse.json(
                {
                    error:
                        "Questions and answers are required",
                },
                {
                    status: 400,
                }
            );
        }

        const mappedAnswers = await mapping(questions, answers);
        return NextResponse.json({
            success: true,
            mappedAnswers,
        });
    } catch (error) {
        console.error("Answer mapping failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to map answers",
            },
            {
                status: 500,
            }
        );
    }
}