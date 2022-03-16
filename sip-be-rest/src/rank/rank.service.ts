import { Injectable } from '@nestjs/common';
import { Constructor } from 'global';
import { RankStrategy } from './rank.strategy';

@Injectable()
export class RankService {
  public rank<T>(data: T[], strategy: Constructor<RankStrategy<T>>): T[] {
    return new strategy().compute(data);
  }
}
