export interface Quiz {
    id: number;
    exam_name: string;
    status: string;
    questions_count: number;
    user: {
        id: number;
        fullname: string;
    };
}

export interface QuizResponse {
    data: {
        data: Quiz[];
        current_page: number;
        last_page: number;
        total: number;
    };
}


export interface ExamCount {
    total: number;
    overall: number;
}

export interface ExamData {
    free: ExamCount;
    sprint: ExamCount;
    mock: ExamCount;
}