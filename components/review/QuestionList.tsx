"use client";

import { useAssessmentStore } from "@/store/assessmentStore";
import { ChevronDown } from "lucide-react";


export default function QuestionList({
  selectedQuestionId,
  onSelect,
}: {
  selectedQuestionId: string | null;
  onSelect: (id: string) => void;
}) {

  const { questions, results } = useAssessmentStore();

  return (
    <div className="bg-neutral-200 rounded-xl h-full overflow-hidden p-3 py-1 border border-neutral-100 flex flex-col">

      <div className=" py-4 border-b border-gray-200 shrink-0">
        <h2 className="font-semibold">
          Extracted questions from the question paper ({questions.length})
        </h2>
      </div>

      <div className="overflow-y-auto flex-1 min-h-0">
        {questions.map((question) => {
          const selected = question.id === selectedQuestionId;
          const result = results.find(resullt => resullt.question.id === question.id);
          const answered = result?.answer !== null && result?.answer !== undefined;

          return (
            <QuestionCard
              key={question.id}
              qnumber={question.number}
              text={question.text}
              selected={selected}
              answered={answered}
              score={result?.score}
              feedback={result?.feedback}
              maxMarks={question.maxMarks}
              onClick={() => onSelect(question.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export const QuestionCard = (
  { qnumber, text, selected, onClick, answered, score, maxMarks, feedback }:
    {
      qnumber: string,
      text: string,
      selected: boolean,
      onClick(): void,
      answered: boolean,
      score?:number,
      maxMarks?:number,
      feedback?:string
    }) => {

      
  const { base, subpart } = splitQuestionNumber(qnumber);
const marksLabel =
    score !== undefined && maxMarks !== undefined
      ? `${score}/${maxMarks}`
      : answered
      ? "Pending"
      : "-";
 
  return (
    <div
      className={`bg-white rounded-xl my-3 shadow-sm overflow-hidden border ${
        selected ? "border-orange-400" : "border-transparent"
      }`}
    >
      <button
        onClick={onClick}
        className="flex w-full gap-4 p-3 items-start text-left"
      >
        {/* Badge: base number only */}
        <div
          className={`${
            selected ? "bg-orange-500" : "bg-neutral-600"
          } shrink-0 px-3 py-1.5 text-white rounded-full text-sm font-bold shadow-sm`}
        >
          {base}
        </div>
 
        {/* Sub-part label, rendered outside/separate from the circle */}
        {subpart && (
          <span className="shrink-0 -ml-2 mt-1.5 text-sm font-semibold text-neutral-500">
            {subpart}
          </span>
        )}
 
        <div className="lg:text-lg flex-1">{text}</div>
 
        {/* Marks, where the status dot used to be */}
        <div
          className={`shrink-0 text-sm font-semibold px-2 py-1 rounded-full ${
            score !== undefined
              ? "bg-green-100 text-green-700"
              : answered
              ? "bg-amber-100 text-amber-700"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {marksLabel}
        </div>
 
        <ChevronDown
          size={18}
          className={`shrink-0 mt-1 text-neutral-400 transition-transform ${
            selected ? "rotate-180" : ""
          }`}
        />
      </button>
 
      {/*
       * Accordion body: AI feedback for this question.
       * Uses the CSS grid-rows trick (0fr -> 1fr) so it animates
       * open/closed smoothly without measuring pixel heights in JS.
       */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          selected ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 border-t border-gray-100">
            {feedback ? (
              <>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">
                  AI Feedback
                </p>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {feedback}
                </p>
              </>
            ) : (
              <p className="text-sm text-neutral-400 italic">
                {answered
                  ? "Grading in progress..."
                  : "No answer found for this question yet."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


/*
 * Splits a question number like "11(a)" into a base number ("11")
 * and a sub-part label ("(a)"), so the badge circle can show only
 * the base number while the sub-part renders separately beside it.
 *
 * "1"      -> { base: "1",  subpart: "" }
 * "11(a)"  -> { base: "11", subpart: "(a)" }
 * "Q2(iii)"-> { base: "Q2", subpart: "(iii)" }
 */
function splitQuestionNumber(qnumber: string) {
  const match = qnumber.match(/^([^(]+)(\(.+\))?$/);
 
  if (!match) {
    return { base: qnumber, subpart: "" };
  }
 
  return {
    base: match[1].trim(),
    subpart: match[2] ?? "",
  };
}
