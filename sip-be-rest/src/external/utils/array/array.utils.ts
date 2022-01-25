export class ArrayUtils {
  public static isPresent<T>(array: T[]): array is T[] {
    return Array.isArray(array) && array.length > 0;
  }

  public static isEmpty<T>(array: T[]) {
    return !array || array.length === 0;
  }
}
