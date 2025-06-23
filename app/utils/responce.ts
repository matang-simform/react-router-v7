interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export function response<T>(success: boolean, data: T): ApiResponse<T> {
    return {
        success,
        data
    };
}