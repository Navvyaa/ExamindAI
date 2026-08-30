import { useAssessmentStore } from '@/store/assessmentStore';
import Image from 'next/image';
import UploadCard from '../UploadCard';
import { ArrowRight } from 'lucide-react';
import { fileToBase64, pdfToImages } from '@/lib/pdf-to-img';
import { mapAnswers } from '@/lib/ai/mapping';
import { buildAssessmentResults } from '@/lib/assessment/buildAssessmentResult';

export default function Uploadscreen() {

    const {
        questionPaper,
        answerSheet,
        setAnswerSheet,
        setQuestionPaper,
        setProcessingStep,
        setAnswers,
        setQuestions,
        setError,
        processingStep,
        setAnswerSheetPages,
        setResults,
    } = useAssessmentStore();
    const canStart = questionPaper && answerSheet;

    const handleStart = async () => {
        if (!questionPaper || !answerSheet) return;
        try {
            setError(null);
            setProcessingStep("extracting-questions");
            const questionFormData = new FormData();
            questionFormData.append("file", questionPaper);
            const questionResponse = await fetch('/api/extract-questions/', {
                method: "POST",
                body: questionFormData,
            });
            const questionData = await questionResponse.json();

            if (!questionResponse.ok) {
                throw new Error(
                    questionData.error ||
                    "Failed to extract questions"
                );
            };
            setQuestions(questionData.questions);
            console.log("Questions extracted:", questionData.questions);


            setProcessingStep("extracting-answers");

            let pageImages: string[];

            if (answerSheet.type === "application/pdf") {
                pageImages = await pdfToImages(answerSheet);
            } else {
                pageImages = [await fileToBase64(answerSheet)];
            }

            setAnswerSheetPages(pageImages);
            const answerResponse = await fetch("/api/extract-answers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pageImages,
                    }),
                }
            );

            const answerData = await answerResponse.json();
            console.log(answerData)

            if (!answerResponse.ok) {
                throw new Error(answerData.error || "Failed to extract answers");
            }

            setAnswers(answerData.answers);

            setProcessingStep("mapping-answers");

            const mappings = await mapAnswers(questionData.questions, answerData.answers);
            const results =buildAssessmentResults( questionData.questions, answerData.answers, mappings);

            setResults(results);
            setProcessingStep("complete");

            console.log("Assessment extraction complete");

        } catch (error) {
            console.error("Assessment processing failed:", error);
            setProcessingStep("error");
            setError(error instanceof Error ? error.message : "Something went wrong");
        }
    }

    return (
        <div><header className="my-2 w-full mx-auto">
            <p className="mb-2 text-center lg:text-4xl text-2xl font-bold capitalize ">
                Upload <span className="lg:bg-orange-100 lg:px-4 text-orange-500 rounded-lg py-1">question paper & answer sheet </span>
            </p>
            <p className="text-lg font-light my-4 text-center hidden md:block">Upload both files to get started</p>

        </header>
            <div className="w-full md:flex items-center justify-center my-4 hidden">
                <Image src="/hero.svg" alt="" width={200} height={200} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 rounded-xl bg-neutral-100 p-4 max-w-5xl mx-auto" >
                <UploadCard
                    title="question paper"
                    value={questionPaper}
                    onChange={setQuestionPaper}
                />

                <UploadCard
                    title="answer sheet"
                    value={answerSheet}
                    onChange={setAnswerSheet}
                />
            </div>

            <div className="mt-6 flex justify-center ">
                <button
                    onClick={handleStart}
                    disabled={!canStart || processingStep === "extracting-questions" || processingStep === "extracting-answers" || processingStep === "grading"}
                    className="rounded-full flex items-center gap-4 bg-black px-6 py-3 text-sm font-mono leading-relaxed text-white transition hover:bg-gray-800 drop-shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    <p>Start Mapping</p> <ArrowRight size={18} />
                </button>
            </div>
            <p className="text-center mt-2 text-xs text-gray-400">Once both files are uploaded you'll be able to map the answers with questions</p></div>
    )
}
