"use client";

import { useState } from "react";
import UploadCard from "@/components/upload/UploadCard";
import { UploadedFile } from "@/types/assessment";

export default function Home() {
  const [questionPaper, setQuestionPaper] =
    useState<UploadedFile | null>(null);

  const [answerSheet, setAnswerSheet] =
    useState<UploadedFile | null>(null);

  const canStart = questionPaper && answerSheet;

  const handleStart = () => {
    if (!canStart) return;

    console.log("Question paper:", questionPaper.file);
    console.log("Answer sheet:", answerSheet.file);

    // We'll connect this to our extraction pipeline next.
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium text-gray-500">
            AI Assessment
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Assess handwritten answers
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Upload a question paper and a student answer sheet
            to extract, map and assess answers automatically.
          </p>
        </header>

        {/* Upload cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <UploadCard
            title="Question paper"
            description="Upload the question paper containing the questions."
            value={questionPaper}
            onChange={setQuestionPaper}
          />

          <UploadCard
            title="Student answer sheet"
            description="Upload the student's handwritten answer sheet."
            value={answerSheet}
            onChange={setAnswerSheet}
          />
        </div>

        {/* Action */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Start assessment
          </button>
        </div>
      </div>
    </main>
  );
}