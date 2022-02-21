export class ArrayUtils {
  public static isPresent<T>(array: T[]): array is T[] {
    return Array.isArray(array) && array.length > 0;
  }

  public static isEmpty<T>(array: T[]) {
    return !array || array.length === 0;
  }

  /**
   * Two input arrays are unsorted
   */
  public static isDiff<T>(arr1: T[], arr2: T[]) {
    if (arr1.length !== arr2.length) return false;

    const uniqueMap = new Map();

    for (let i = 0; i < arr1.length; i++) {
      if (!uniqueMap.has(arr1[i])) {
        uniqueMap.set(arr1[i], 0);
      } else if (uniqueMap.get(arr1[i]) === 0) {
        uniqueMap.set(arr1[i], uniqueMap.get(arr1[i]) + 1);
      } else {
        return false;
      }

      if (!uniqueMap.has(arr2[i])) {
        uniqueMap.set(arr2[i], 0);
      } else if (uniqueMap.get(arr2[i]) === 0) {
        uniqueMap.set(arr2[i], uniqueMap.get(arr2[i]) + 1);
      } else {
        return false;
      }
    }

    return [...uniqueMap.values()].some((val) => val === 1);
  }

  public static moreThan<T>(count: number, arr: T[]): boolean {
    return ArrayUtils.isPresent(arr) && arr.length > count;
  }

  public static has<T>(count: number, arr: T[]): boolean {
    return ArrayUtils.isPresent(arr) && arr.length === count;
  }
}
