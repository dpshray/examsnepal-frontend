export type ExamType = "public" | "private";

export interface ExamSection {
  id: number;
  title: string;
  slug: string;
  detail: string;
  question_count?: number;
  attempts_count?: number;
  is_completed?: boolean;
}

export interface ExamDetails {
  exam_id: number;
  title: string;
  slug: string;
  exam_date: string | null;
  start_time: string;
  end_time: string;
  description: string;
  instructions: string;
  duration: number;
  limit_attempts: number;
  exam_type: ExamType;
  sections: ExamSection[];
}

export interface ExamDetailsResponse {
  status: boolean;
  data: ExamDetails;
  message: string;
}

export interface QuestionOption {
  id: number
  option: string
}

export interface Question {
  id: number
  number: number
  section_id: number
  question_type: "mcq" | string
  question: string
  description: string | null
  full_marks: string
  negative_marks: string

  is_negative_marking: boolean

  image_url: string | null

  options: QuestionOption[]

  created_at: string
  updated_at: string 
}

export type AnswerValue = number | string | null

export interface ExamState {
  selectedSection: string | null
  attemptIds: Map<string, number>
  answers: Map<string, Map<number, AnswerValue>>
  currentPage: number
  tabSwitchCount: number
  submittedSections: Set<string>
}

export interface StorageKeys {
  selectedSection: string
  attemptIds: string
  answers: string
  currentPage: string
  tabSwitchCount: string
  submittedSections: string
}

