export interface RankStrategy<T> {
  getWeights(): Record<string, number>;
  compute(input: T[]): T[];
}
