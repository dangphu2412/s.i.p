export const ArrayUtils = {
    isEmpty<T>(value: T[] | undefined | null): value is undefined | null {
        return !value || !Array.isArray(value);
    }
};