"use client";

import { useState } from "react";
import QuestionList from "../review/QuestionList";
import { useAssessmentStore } from "@/store/assessmentStore";
import AnswerViewer from "../review/AnswerViewer";

export default function ReviewScreen() {
  const { questions, answers } = useAssessmentStore();
  const [activeTab, setActiveTab] = useState<"questions" | "answers">("questions");

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
    <div className="h-full min-h-0 flex flex-col">
      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex gap-2 mb-4 bg-gray-200 p-1 rounded-full">
        <button
          onClick={() => setActiveTab("questions")}
          className={`flex-1 py-2 px-3 rounded-full font-semibold transition ${activeTab === "questions"
              ? "bg-neutral-800 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Questions
        </button>
        <button
          onClick={() => setActiveTab("answers")}
          className={`flex-1 py-2 px-3 rounded-full font-semibold transition ${activeTab === "answers"
              ? "bg-neutral-800 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Answers
        </button>
      </div>

      {/* Desktop Grid + Mobile Tab Content */}
      <div className="h-full min-h-0 grid lg:grid-cols-2 gap-6">
        {/* Questions Section */}
        <div className={`min-h-0 overflow-hidden ${activeTab === "answers" && "lg:block hidden"}`}>
          <QuestionList
            selectedQuestionId={selectedQuestionId}
            onSelect={setSelectedQuestionId}
          />
        </div>

        {/* Answers Section */}
        <div className={`min-h-0 overflow-hidden bg-white rounded-xl ${activeTab === "questions" && "lg:block hidden"}`}>
          <AnswerViewer answer={selectedAnswer} />
        </div>
      </div>
    </div>
  );
}