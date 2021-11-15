export type AppError = {
    message?: string;
    hasError: boolean;
}

export type AppLoading = {
    isLoading: boolean;
    content?: string;
}

export type AppState = {
    error: AppError,
    loading: AppLoading
}