import { Injectable } from '@nestjs/common';
import { Constructor } from 'global';
import { RankStrategy } from './rank.strategy';

@Injectable()
export class RankService {
  /**
   * TODO: At first we need to know about the weights of properties which are used to calculate the rank.
   * Implement strategy pattern to calculate the rank.
   */
  public rank<T>(data: T[], strategy: Constructor<RankStrategy<T>>): T[] {
    return new strategy().compute(data);
  }
}
