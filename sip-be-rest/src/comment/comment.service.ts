import { Discussion } from '@discussion/discussion.entity';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@post/post.entity';
import { User } from '@user/user.entity';
import { TreeRepository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { DiscussionComment } from './entities/discussion-comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: TreeRepository<Comment>,
    @InjectRepository(DiscussionComment)
    private readonly discussionCommentRepository: TreeRepository<DiscussionComment>,
  ) {}

  public async createCommentForPost(
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

  public async createCommentForDiscussion(
    discussion: Discussion,
    createDiscussionDto: CreateCommentDto,
    author: User,
  ) {
    createDiscussionDto.content = createDiscussionDto.content.trim();

    if (!createDiscussionDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }

    const comment = new DiscussionComment();

    comment.content = createDiscussionDto.content;
    comment.author = author;
    comment.discussion = discussion;
    comment.parent = null;

    await this.discussionCommentRepository.save(comment);

    return comment;
  }

  public async createReplyForPost(
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

  public async createReplyForDiscussion(
    commentId: string,
    createReplyDto: CreateCommentDto,
    author: User,
    discussion: Discussion,
  ) {
    createReplyDto.content = createReplyDto.content.trim();

    if (!createReplyDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }

    const comment = await this.discussionCommentRepository.findOne(commentId);

    if (!comment) {
      throw new NotFoundException('No parent comment found');
    }

    const reply = new DiscussionComment();

    reply.content = createReplyDto.content;
    reply.author = author;
    reply.parent = comment;
    reply.discussion = discussion;
    return this.commentRepository.save(reply);
  }

  public findCommentsOfPost(post: Post, searchCriteria: SearchCriteria) {
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

  public findCommentsOfDiscussion(
    discussion: Discussion,
    searchCriteria: SearchCriteria,
  ) {
    return this.discussionCommentRepository.find({
      where: {
        discussion,
        parent: null,
      },
      relations: ['author', 'replies', 'replies.author'],
      skip: searchCriteria.offset,
      take: searchCriteria.limit,
    });
  }
}
