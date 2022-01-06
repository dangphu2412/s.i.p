import { AccessRights } from '@constants/access-rights.enum';
import { RuleManager } from '@external/racl/core/rule.manager';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private userService: UserService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    createCommentDto.content = createCommentDto.content.trim();

    if (!createCommentDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }
    const author = await this.userService.findById(createCommentDto.authorId);

    if (!author) {
      throw new UnprocessableEntityException(
        'Author is not persisting, maybe they have been banned',
      );
    }

    const comment = new Comment();

    comment.content = createCommentDto.content;
    comment.author = author;

    return this.commentRepository.save(comment);
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    ruleManager: RuleManager,
  ) {
    const comment = await this.commentRepository.findOne(id);

    if (!comment) {
      throw new NotFoundException('No comment found for updating');
    }

    ruleManager.throwIfCannot(AccessRights.RootAccess.EDIT_OWN, {
      authorId: updateCommentDto.authorId,
      ownerId: comment.author.id,
    });

    if (comment.content !== updateCommentDto.content) {
      comment.content = updateCommentDto.content;
      await this.commentRepository.update(id, comment);
    }
  }
}
