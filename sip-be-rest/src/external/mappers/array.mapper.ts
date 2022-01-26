export class ArrayMapper {
  public static mapByKeys<T>(array: T[], keys: string[]) {
    return array.map((i) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = i[key];
      });
      return result;
    });
  }

  public static mapByKey<T, K>(array: T[], key: string): K[] {
    return array.map((i) => i[key] as K);
  }
}
