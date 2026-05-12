export interface LocalizedContent {
    vi: string;
    en?: string;
    ja?: string;
    [key: string]: string | undefined;
}

export interface Lesson {
    day: number;
    title: string; // Default title (usually Vietnamese)
    titles?: LocalizedContent; // Localized titles if available
    content?: string | LocalizedContent; // Content is optional for metadata-only usage
}

export interface Phase {
    id: string; // e.g. "phase1"
    title: string;
    description?: string;
    days: Lesson[];
}
