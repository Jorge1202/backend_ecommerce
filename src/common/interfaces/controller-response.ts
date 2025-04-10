export interface ResponseFormat<T> {
    error: boolean;
    status: number;
    message: string;
    body?: T | null;
    tokens?: Record<string, string> | null;
}
