import { UserCredential } from '@auth/client/user-cred';
import { CreateDiscussionDto } from '@discussion/dto/create-discussion.dto';
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
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { Discussion } from './entities/discussion.entity';
import { UserService } from '@user/user.service';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: TreeRepository<Comment>,
    @InjectRepository(Discussion)
    private readonly discussionRepository: TreeRepository<Discussion>,
    private readonly userService: UserService,
  ) {}

  public async createComment(
    post: Post,
    createDiscussionDto: CreateCommentDto,
    author: User,
  ) {
    createDiscussionDto.content = createDiscussionDto.content.trim();

    if (!createDiscussionDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }

    const comment = new Comment();

    comment.content = createDiscussionDto.content;
    comment.author = author;
    comment.post = post;
    comment.parent = null;

    await this.commentRepository.save(comment);

    return comment;
  }

  public async createReply(
    commentId: string,
    createReplyDto: CreateCommentDto,
    author: User,
    post: Post,
  ) {
    createReplyDto.content = createReplyDto.content.trim();

    if (!createReplyDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }

    const discussion = await this.commentRepository.findOne(commentId);

    if (!discussion) {
      throw new NotFoundException('No parent comment found');
    }

    const reply = new Comment();

    reply.content = createReplyDto.content;
    reply.author = author;
    reply.parent = discussion;
    reply.post = post;
    return this.commentRepository.save(reply);
  }

  public async createDiscussion(
    createDiscussionDto: CreateDiscussionDto,
    authContext: UserCredential,
  ) {
    createDiscussionDto.content = createDiscussionDto.content.trim();

    if (!createDiscussionDto.content) {
      throw new BadRequestException('Content of discussion can not be empty');
    }

    const discussion = new Discussion();

    discussion.title = createDiscussionDto.title;
    discussion.content = createDiscussionDto.content;
    discussion.author = await this.userService.findById(+authContext.userId);

    return this.discussionRepository.save(discussion);
  }

  public findDiscussionsOfPost(post: Post, searchCriteria: SearchCriteria) {
    return this.commentRepository.find({
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
    const comment = await this.commentRepository.findOne(id);

    if (!comment) {
      throw new NotFoundException('No comment found for updating');
    }

    ruleManager.throwIfCannot(AccessRights.RootAccess.EDIT_OWN, {
      authorId: updateDiscussionDto.authorId,
      ownerId: comment.author.id,
    });

    if (comment.content !== updateDiscussionDto.content) {
      comment.content = updateDiscussionDto.content;
      await this.commentRepository.update(id, comment);
    }
  }
}
