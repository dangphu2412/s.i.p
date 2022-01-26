import { toPage } from '@external/crud/extensions/typeorm-pageable';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserCredential } from 'src/auth/client/user-cred';
import {
  OptionalProtected,
  Protected,
} from 'src/auth/decorator/protected.decorator';
import { AuthContext } from 'src/auth/decorator/user-cred.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { InitPostDto } from './dto/init-post.dto';
import { FetchPostsOverviewValidator } from './pipes/overview-search.validator';
import { PostService } from './post.service';

@ApiTags('posts')
@Controller('v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Protected
  @Post()
  initializePost(
    @Body() initPostDto: InitPostDto,
    @AuthContext() authContext: UserCredential,
  ) {
    return this.postService.init(initPostDto, authContext);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Protected
  @Put('/:id/votes')
  upsertVoteOfPost(
    @Param('id') id: string,
    @AuthContext() author: UserCredential,
  ) {
    return this.postService.upsertVoteOfPost(+id, author);
  }

  @OptionalProtected
  @Get()
  async findMany(
    @SearchQuery(FetchPostsOverviewValidator) searchQuery: SearchCriteria,
    @AuthContext() author: UserCredential | undefined,
  ) {
    const posts = await this.postService.findMany(searchQuery, author);
    return toPage(posts, searchQuery);
  }

  @OptionalProtected
  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
    @AuthContext() author: UserCredential | undefined,
  ) {
    return this.postService.findOne(slug, author);
  }

  @Get(':id/discussions')
  async findRelatedDiscussions(
    @Param('id') id: string,
    @SearchQuery() searchCriteria: SearchCriteria,
  ) {
    const discussions = await this.postService.findRelatedDiscussions(
      +id,
      searchCriteria,
    );
    return toPage(discussions, searchCriteria);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
