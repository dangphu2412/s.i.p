import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import {
  OptionalProtected,
  Protected,
} from '@modules/auth/decorator/protected.decorator';
import { AuthContext } from '@modules/auth/decorator/user-cred.decorator';
import { UserCredential } from '@modules/auth/types/user-cred.interface';
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
  @Post('/:postId/votes')
  upsertVoteOfPost(
    @Param('postId') postId: string,
    @AuthContext() author: UserCredential,
  ) {
    return this.postService.upsertVoteOfPost(+postId, author);
  }

  @OptionalProtected
  @Get()
  findAll(
    @SearchQuery(FetchPostsOverviewValidator) searchQuery: SearchCriteria,
    @AuthContext() author: UserCredential | undefined,
  ) {
    return this.postService.findAll(searchQuery, author);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
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
