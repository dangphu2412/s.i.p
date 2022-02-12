import { AccessRights } from '@constants/access-rights.enum';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { RuleManager } from '@external/racl/core/rule.manager';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@post/post.entity';
import { User } from '@user/user.entity';
import { TreeRepository } from 'typeorm';
import { Discussion } from './discussion.entity';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(Discussion)
    private readonly discussionRepository: TreeRepository<Discussion>,
  ) {}

  public async createComment(
    post: Post,
    createDiscussionDto: CreateDiscussionDto,
    author: User,
  ) {
    createDiscussionDto.content = createDiscussionDto.content.trim();

    if (!createDiscussionDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }

    const discussion = new Discussion();

    discussion.content = createDiscussionDto.content;
    discussion.author = author;
    discussion.post = post;
    discussion.parent = null;

    await this.discussionRepository.save(discussion);

    return discussion;
  }

  public async createReply(
    commentId: string,
    createReplyDto: CreateDiscussionDto,
    author: User,
    post: Post,
  ) {
    createReplyDto.content = createReplyDto.content.trim();

    if (!createReplyDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }

    const discussion = await this.discussionRepository.findOne(commentId);

    if (!discussion) {
      throw new NotFoundException('No parent comment found');
    }

    const reply = new Discussion();

    reply.content = createReplyDto.content;
    reply.author = author;
    reply.parent = discussion;
    reply.post = post;
    return this.discussionRepository.save(reply);
  }

  public findDiscussionsOfPost(post: Post, searchCriteria: SearchCriteria) {
    return this.discussionRepository.find({
      where: {
        post,
        parent: null,
      },
      relations: ['author', 'replies', 'replies.author'],
      skip: searchCriteria.offset,
      take: searchCriteria.limit,
    });
  }

  public async update(
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
