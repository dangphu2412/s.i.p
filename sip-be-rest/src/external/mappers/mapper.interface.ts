export interface Mapper<Input, Result> {
  map(input: Input): Result;
}
