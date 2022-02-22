import { Injectable } from '@nestjs/common';

export interface Validator<D> {
  error: Error;
  accept(input: D): boolean;
}

@Injectable()
export class ValidatorHandler {
  public handle<D, T extends Validator<D>>(validatorCaller: T, data: D) {
    if (!validatorCaller.accept(data)) {
      throw validatorCaller.error;
    }
  }
}
