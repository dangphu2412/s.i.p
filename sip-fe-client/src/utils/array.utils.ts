export const ArrayUtils = {
    isEmpty<T>(value: T[] | undefined | null): value is undefined | null {
        return !value || !Array.isArray(value);
    },

    isPresent<T>(array: T[]): array is T[] {
        return Array.isArray(array) && array.length > 0;
    }
};