import { Question, StudentAnswer, AssessmentResult } from "@/types/assessment";

/*
 * Thin, typed wrappers around each assessment API route.
 *
 * Each function does exactly one job: call the route, and either
 * return the parsed payload or throw an Error with the server's
 * message. No store access, no step-sequencing here — that stays
 * in the component that orchestrates the flow.
 */

export async function extractQuestionsRequest(
    questionPaper: File
): Promise<Question[]> {
    const formData = new FormData();
    formData.append("file", questionPaper);

    const res = await fetch("/api/extract-questions/", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to extract questions");
    }

    return data.questions;
}

export async function extractAnswersRequest(
    pageImages: string[]
): Promise<StudentAnswer[]> {
    const res = await fetch("/api/extract-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageImages }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to extract answers");
    }

    return data.answers;
}

export async function mapAnswersRequest(
    questions: Question[],
    answers: StudentAnswer[]
) {
    const res = await fetch("/api/map-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to map answers");
    }

    return data.mappedAnswers;
}

export async function gradeResultsRequest(
    results: AssessmentResult[]
): Promise<AssessmentResult[]> {
    const res = await fetch("/api/grade-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to grade answers");
    }

    return data.results;
}