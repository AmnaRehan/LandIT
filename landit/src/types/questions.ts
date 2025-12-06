export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType = "multiple-choice" | "text";

export interface Question {
  _id?: string;
  text: string;
  difficulty: Difficulty;
  type: QuestionType;
  options?: string[]; // For multiple choice
  correctAnswer?: string; // For scoring
  jobDescriptionId: string;
  createdAt?: number;
}
export interface UserAnswer {
  _id?: string;
  questionId: string;
  userId: string;
  answer: string;
  isCorrect: boolean;
  score: number; // 0-10
  feedback: string;
  submittedAt: number;
}

export interface JobDescription {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  requirements: string[];
  createdAt: number;
}

export interface QuestionSession {
  difficulty: Difficulty;
  questions: Question[];
  answers: Map<string, string>;
}
