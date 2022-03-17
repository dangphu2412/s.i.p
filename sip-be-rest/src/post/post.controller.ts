import { FilterUtils } from '@external/crud/common/pipes/filter.pipe';
import { PageExtension } from '@external/crud/extensions/typeorm-pageable';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import { RuleManager } from '@external/racl/core/rule.manager';
import { ExtractRuleManager } from '@external/racl/decorator/get-manager.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserCredential } from 'src/auth/client/user-cred';
import {
  OptionalProtected,
  Protected,
} from 'src/auth/decorator/protected.decorator';
import { AuthContext } from 'src/auth/decorator/user-cred.decorator';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { InitPostDto } from './dto/init-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FetchDetailType } from './enums/fetch-post-type.enum';
import { PostStatus } from './enums/post-status.enum';
import { FetchAuthorPostsValidator } from './pipes/author-posts-search.validator';
import { FetchPostsOverviewValidator } from './pipes/overview-search.validator';
import { FetchPostsDetailValidator } from './pipes/post-detail.validator';
import { PostUseCase } from './post.usecase';

@ApiTags('posts')
@Controller('v1/posts')
export class PostController {
  constructor(private readonly postUseCase: PostUseCase) {}

  @Protected
  @Post()
  initializePost(
    @Body() initPostDto: InitPostDto,
    @AuthContext() authContext: UserCredential,
  ) {
    return this.postUseCase.init(initPostDto, authContext);
  }

  @Protected
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Query('status') status: PostStatus,
  ) {
    return this.postUseCase.update(+id, status, updatePostDto);
  }

  @Protected
  @Put('/:id/votes')
  upsertVoteOfPost(
    @Param('id') id: string,
    @AuthContext() author: UserCredential,
  ) {
    return this.postUseCase.upsertVoteOfPost(+id, author);
  }

  @Protected
  @Put('/:id/follow')
  followIdea(
    @AuthContext() authContext: UserCredential,
    @Param('id') id: string,
  ) {
    return this.postUseCase.followIdea(id, authContext);
  }

  @OptionalProtected
  @Get()
  async findMany(
    @SearchQuery(FetchPostsOverviewValidator) searchQuery: SearchCriteria,
    @AuthContext() author: UserCredential | undefined,
  ) {
    PageExtension.setInfinitiveReq(searchQuery);
    const posts = await this.postUseCase.findMany(searchQuery, author);
    return PageExtension.toInfinitivePage(posts, searchQuery);
  }

  @OptionalProtected
  @Get('/ideas')
  async findIdeas(
    @SearchQuery(FetchPostsOverviewValidator) searchQuery: SearchCriteria,
    @AuthContext() author: UserCredential | undefined,
  ) {
    const posts = await this.postUseCase.findIdeas(searchQuery, author);
    return PageExtension.toInfinitivePage(posts, searchQuery);
  }

  @OptionalProtected
  @Get('/users/:hashTag')
  async findPostsOfAuthor(
    @Param('hashTag') hashTag: string,
    @SearchQuery(FetchAuthorPostsValidator) searchQuery: SearchCriteria,
    @AuthContext() author: UserCredential | undefined,
  ) {
    PageExtension.setInfinitiveReq(searchQuery);
    const posts = await this.postUseCase.findPostsOfAuthor(
      searchQuery,
      hashTag,
      author,
    );
    return PageExtension.toInfinitivePage(posts as [], searchQuery);
  }

  @OptionalProtected
  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
    @AuthContext() author: UserCredential | undefined,
    @SearchQuery(FetchPostsDetailValidator) searchCriteria: SearchCriteria,
  ) {
    const getType = FilterUtils.get(searchCriteria.filters, 'type');
    switch (getType) {
      case FetchDetailType.DETAIL:
        return this.postUseCase.findOneForDetail(slug, author);
      case FetchDetailType.EDIT:
        return this.postUseCase.findOneForEdit(slug);
      default:
        throw new BadRequestException('Invalid type to fetch detail post data');
    }
  }

  @Get(':slug/comments')
  async findRelatedDiscussions(
    @Param('slug') slug: string,
    @SearchQuery() searchCriteria: SearchCriteria,
  ) {
    PageExtension.setInfinitiveReq(searchCriteria);
    const discussions = await this.postUseCase.findRelatedDiscussions(
      slug,
      searchCriteria,
    );
    return PageExtension.toInfinitivePage(discussions, searchCriteria);
  }

  @Protected
  @Post(':slug/comments')
  async createComment(
    @Param('slug') slug: string,
    @Body() createDiscussionDto: CreateCommentDto,
    @AuthContext() author: UserCredential,
  ) {
    await this.postUseCase.createCommentOfPost(
      slug,
      createDiscussionDto,
      author,
    );
  }

  @Protected
  @Post(':slug/comments/:commentId/replies')
  async createReply(
    @Param('slug') slug: string,
    @Param('commentId') commentId: string,
    @Body() createDiscussionDto: CreateCommentDto,
    @AuthContext() author: UserCredential,
  ) {
    return this.postUseCase.createReplyOfPost(
      slug,
      commentId,
      createDiscussionDto,
      author,
    );
  }

  @Protected
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @AuthContext() authContext: UserCredential,
    @ExtractRuleManager() ruleManager: RuleManager,
  ) {
    return this.postUseCase.remove(+id, authContext, ruleManager);
  }
}
