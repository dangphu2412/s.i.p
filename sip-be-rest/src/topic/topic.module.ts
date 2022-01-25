import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicController } from './topic.controller';
import { TopicRepository } from './topic.repository';
import { TopicService } from './topic.service';

@Module({
  imports: [TypeOrmModule.forFeature([TopicRepository])],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
