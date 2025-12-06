export interface JobAction {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
}

export interface ActivityData {
  questions: number;
  correct: number;
  incorrect: number;
}

export interface ChartData {
  questionsAttempted: number;
  interviewsTaken: number;
  resumeUploaded: number;
}
