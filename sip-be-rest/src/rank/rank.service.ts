import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constructor } from 'global';
import { In, Repository } from 'typeorm';
import { Rank } from './rank.entity';
import { RankStrategy } from './rank.strategy';

@Injectable()
export class RankService {
  constructor(
    @InjectRepository(Rank)
    private readonly rankRepository: Repository<Rank>,
  ) {}

  public rank<T>(data: T[], strategy: Constructor<RankStrategy<T>>): T[] {
    return new strategy().compute(data);
  }

  public store(rankDate: Date, rankingPoints: Record<string, number>) {
    const rank = new Rank();
    rank.rankDate = rankDate;
    rank.rankingPoints = rankingPoints;

    return this.rankRepository.save(rank);
  }

  public getByRankDates(dates: Date[]) {
    return this.rankRepository.find({
      where: { rankDate: In(dates) },
    });
  }
}
