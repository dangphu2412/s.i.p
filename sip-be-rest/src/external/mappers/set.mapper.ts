export class SetMapper {
  public static mapByKey<T, K>(array: T[], key: string): K[] {
    const result: K[] = [];
    if (!array.length) return result;
    const map = new Map<string, number>();
    array.forEach((value) => {
      if (!map.has(value[key])) {
        result.push(value[key]);
      }
    });
    return result;
  }
}
