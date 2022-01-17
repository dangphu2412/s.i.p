import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import {
  OptionalProtected,
  Protected,
} from 'src/auth/decorator/protected.decorator';
import { AuthContext } from 'src/auth/decorator/user-cred.decorator';
import { UserCredential } from 'src/auth/client/user-cred';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostOverview } from './client/post-overview.api';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FetchPostsOverviewValidator } from './pipes/overview-search.validator';
import { PostService } from './post.service';

@ApiTags('posts')
@Controller('v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Protected
  @Post('/:id/votes')
  upsertVoteOfPost(
    @Param('id') id: string,
    @AuthContext() author: UserCredential,
  ) {
    return this.postService.upsertVoteOfPost(+id, author);
  }

  @OptionalProtected
  @Get()
  findMany(
    @SearchQuery(FetchPostsOverviewValidator) searchQuery: SearchCriteria,
    @AuthContext() author: UserCredential | undefined,
  ): Promise<PostOverview> {
    return this.postService.findMany(searchQuery, author);
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
  findRelatedDiscussions(
    @Param('id') id: string,
    @SearchQuery() searchCriteria: SearchCriteria,
  ) {
    return this.postService.findRelatedDiscussions(+id, searchCriteria);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
