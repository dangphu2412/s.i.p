import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { Rank } from './rank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rank])],
  providers: [RankService],
  exports: [RankService],
})
export class RankModule {}
