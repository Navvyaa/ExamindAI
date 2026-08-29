"use client";

import { useAssessmentStore } from "@/store/assessmentStore";

export default function QuestionList({
  selectedQuestionId,
  onSelect,
}: {
  selectedQuestionId: string | null;
  onSelect: (id: string) => void;
}) {
    const {questions,answers}=useAssessmentStore();
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
      const answered = answers.some(
        (a) => a.questionNumber === question.number
      );

      return (
        <QuestionCard
          key={question.id}
          qnumber={question.number}
          text={question.text}
          selected={selected}
          answered={answered}
          onClick={() => onSelect(question.id)}
        />
      );
    })}
  </div>
</div>
  );
}

export const  QuestionCard=(
    {qnumber,text,selected,onClick,answered}:
    {   qnumber:string,
        text:string,
        selected:boolean,
        onClick():void,
        answered:boolean
    })=>{
    return (
        <button
        onClick={onClick} className={`bg-white rounded-xl text-lg flex w-full my-3 gap-4 p-2 items-start jus ${selected? "border-orange-400":""}`}>
            <div className={`${selected? " bg-orange-500":"bg-neutral-600"} px-3 py-1.5 text-white rounded-full text-sm font-bold shadow-sm`}>{qnumber}</div>
            <div className="text-left">{text}</div>
            <div className={`mt-2 h-2 w-2 shrink-0 rounded-full justify-end ${answered ? "bg-green-500" : "bg-gray-300" }`}/>
        </button>
    )
}