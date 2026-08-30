"use client";

import { useState } from "react";
import QuestionList from "../review/QuestionList";
import { useAssessmentStore } from "@/store/assessmentStore";
import AnswerViewer from "../review/AnswerViewer";

export default function ReviewScreen() {
  const { questions,answers } = useAssessmentStore();

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    questions[0]?.id ?? null
  );
  const selectedQuestion = questions.find(
    (question) => question.id === selectedQuestionId
  );

  const selectedAnswer = answers.find(
    (answer) =>
      answer.questionNumber === selectedQuestion?.number
  );

  return (
  <div className="h-full min-h-0 grid grid-cols-2 gap-6">
    <div className="min-h-0 overflow-hidden">
      <QuestionList
        selectedQuestionId={selectedQuestionId}
        onSelect={setSelectedQuestionId}
      />
    </div>

    <div className="min-h-0 overflow-hidden bg-white rounded-xl">
      <AnswerViewer answer={selectedAnswer} />
    </div>
  </div>
);
}