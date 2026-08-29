"use client";

import { useState } from "react";
import QuestionList from "../review/QuestionList";
import { useAssessmentStore } from "@/store/assessmentStore";

export default function ReviewScreen() {
  const { questions } = useAssessmentStore();

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    questions[0]?.id ?? null
  );

  return (
    <div className="h-full min-h-0 grid grid-cols-2 gap-6">
      <QuestionList
        selectedQuestionId={selectedQuestionId}
        onSelect={setSelectedQuestionId}
      />

      <div className="bg-white rounded-xl">
        {/* AnswerViewer will go here */}
      </div>
    </div>
  );
}