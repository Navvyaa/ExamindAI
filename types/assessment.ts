export interface UploadedFile {
  file: File;
  previewUrl: string;
}

export interface Question {
  id: string;
  number: string;
  text: string;
  order: number;
  page:number;
  maxMarks:number;
}

export interface AnswerRegion {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StudentAnswer {
  id: string;
  questionNumber: string | null;
  text: string;
  regions: AnswerRegion[];
}

export interface AssessmentResult {
  question: Question;
  answer: StudentAnswer | null;
  score?: number;
  feedback?: string;
}