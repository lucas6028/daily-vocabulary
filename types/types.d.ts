export interface Vocabulary {
    id: string;
    word: string;
    definition: string;
    example: string;
    level: string;
    dateAdded: string;
    imagePrompt: string;
    reviewSchedule: ReviewSchedule[];
    lastReviewed: string | null; 
    reviewHistory: string[];
}
export interface ReviewSchedule {
    date: string;
    completed: boolean;
}