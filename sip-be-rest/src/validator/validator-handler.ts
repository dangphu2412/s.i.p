import { Injectable } from '@nestjs/common';

export interface Validator<D> {
  validate(input: D): void | Promise<void>;
}

export interface Comparable<BaseData, TargetData> {
  compare(base: BaseData, targetData: TargetData): void | Promise<void>;
}

@Injectable()
export class ValidatorHandler {}
