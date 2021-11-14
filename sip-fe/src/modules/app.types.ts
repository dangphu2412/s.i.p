export type AppError = {
    message?: string;
    hasError: boolean;
}

export type AppState = {
    error: AppError
}