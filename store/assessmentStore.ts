import { create } from "zustand";

import {
  Question,
  StudentAnswer,
  AssessmentResult,
} from "@/types/assessment";

type ProcessingStep =
  | "idle"
  | "extracting-questions"
  | "extracting-answers"
  | "mapping-answers"
  | "grading"
  | "complete"
  | "error";

interface AssessmentStore {
  questionPaper: File | null;
  answerSheet: File | null;

  questions: Question[];
  answers: StudentAnswer[];
  results: AssessmentResult[];

  selectedQuestionId: string | null;

  processingStep: ProcessingStep;
  error: string | null;

  setQuestionPaper: (file: File | null) => void;
  setAnswerSheet: (file: File | null) => void;

  setQuestions: (questions: Question[]) => void;
  setAnswers: (answers: StudentAnswer[]) => void;
  setResults: (results: AssessmentResult[]) => void;

  setSelectedQuestion: (questionId: string | null) => void;

  setProcessingStep: (step: ProcessingStep) => void;
  setError: (error: string | null) => void;

  answerSheetPages: string[];

  setAnswerSheetPages: (pages: string[]) => void;

  resetAssessment: () => void;
}

export const useAssessmentStore =
  create<AssessmentStore>((set) => ({
    questionPaper: null,
    answerSheet: null,

    questions: [],
    answers: [],
    results: [],

    selectedQuestionId: null,

    processingStep: "idle",
    answerSheetPages: [],
    error: null,

    setQuestionPaper: (file) =>
      set({
        questionPaper: file,
      }),

    setAnswerSheet: (file) =>
      set({
        answerSheet: file,
      }),

    setQuestions: (questions) =>
      set({
        questions,
      }),

    setAnswers: (answers) =>
      set({
        answers,
      }),

    setResults: (results) =>
      set({
        results,
      }),

    setSelectedQuestion: (questionId) =>
      set({
        selectedQuestionId: questionId,
      }),

    setProcessingStep: (step) =>
      set({
        processingStep: step,
      }),

    setAnswerSheetPages: (pages) =>
      set({
        answerSheetPages: pages,
      }),

    setError: (error) =>
      set({
        error,
      }),

    resetAssessment: () =>
      set({
        questionPaper: null,
        answerSheet: null,
        questions: [],
        answers: [],
        results: [],
        selectedQuestionId: null,
        processingStep: "idle",
        answerSheetPages:[],
        error: null,
      }),
  }));