import { RuleManager } from '@external/racl/core/rule.manager';
import { ExtractRuleManager } from '@external/racl/decorator/get-manager.decorator';
import { Protected } from '@modules/auth/decorator/protected.decorator';
import { AuthContext } from '@modules/auth/decorator/user-cred.decorator';
import { UserCredential } from '@modules/auth/types/user-cred.interface';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@Controller('v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Protected
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @AuthContext() author: UserCredential,
  ) {
    createCommentDto.authorId = +author.userId;
    return this.commentService.create(createCommentDto);
  }

  @Protected
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @AuthContext() author: UserCredential,
    @ExtractRuleManager() ruleManager: RuleManager,
  ) {
    updateCommentDto.authorId = +author.userId;
    return this.commentService.update(+id, updateCommentDto, ruleManager);
  }
}
