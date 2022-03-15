export interface RankStrategy<T> {
  getProperties(): string[];
  compute(input: T[]): T[];
}
