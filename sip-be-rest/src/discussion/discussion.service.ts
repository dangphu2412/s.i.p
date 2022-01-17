import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { AccessRights } from '@constants/access-rights.enum';
import { RuleManager } from '@external/racl/core/rule.manager';
import { Post } from 'src/post/post.entity';
import { UserService } from 'src/user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discussion } from './discussion.entity';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(Discussion)
    private discussionRepository: Repository<Discussion>,
    private userService: UserService,
  ) {}

  async create(createDiscussionDto: CreateDiscussionDto) {
    createDiscussionDto.content = createDiscussionDto.content.trim();

    if (!createDiscussionDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }
    const author = await this.userService.findById(
      createDiscussionDto.authorId,
    );

    if (!author) {
      throw new UnprocessableEntityException(
        'Author is not persisting, maybe they have been banned',
      );
    }

    const discussion = new Discussion();

    discussion.content = createDiscussionDto.content;
    discussion.author = author;

    return this.discussionRepository.save(discussion);
  }

  findRelatedDiscussions(post: Post, searchCriteria: SearchCriteria) {
    return this.discussionRepository.find({
      where: {
        post,
      },
      skip: searchCriteria.offset,
      take: searchCriteria.limit,
    });
  }

  async update(
    id: number,
    updateDiscussionDto: UpdateDiscussionDto,
    ruleManager: RuleManager,
  ) {
    const comment = await this.discussionRepository.findOne(id);

    if (!comment) {
      throw new NotFoundException('No comment found for updating');
    }

    ruleManager.throwIfCannot(AccessRights.RootAccess.EDIT_OWN, {
      authorId: updateDiscussionDto.authorId,
      ownerId: comment.author.id,
    });

    if (comment.content !== updateDiscussionDto.content) {
      comment.content = updateDiscussionDto.content;
      await this.discussionRepository.update(id, comment);
    }
  }
}
