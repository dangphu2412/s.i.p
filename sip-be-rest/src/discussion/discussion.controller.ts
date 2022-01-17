import { UserCredential } from '@auth/client/user-cred';
import { Protected } from '@auth/decorator/protected.decorator';
import { AuthContext } from '@auth/decorator/user-cred.decorator';
import { RuleManager } from '@external/racl/core/rule.manager';
import { ExtractRuleManager } from '@external/racl/decorator/get-manager.decorator';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@ApiTags('discussions')
@Controller('v1/discussions')
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Protected
  @Post()
  create(
    @Body() createDiscussionDto: CreateDiscussionDto,
    @AuthContext() author: UserCredential,
  ) {
    createDiscussionDto.authorId = +author.userId;
    return this.discussionService.create(createDiscussionDto);
  }

  @Protected
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscussionDto: UpdateDiscussionDto,
    @AuthContext() author: UserCredential,
    @ExtractRuleManager() ruleManager: RuleManager,
  ) {
    updateDiscussionDto.authorId = +author.userId;
    return this.discussionService.update(+id, updateDiscussionDto, ruleManager);
  }
}
