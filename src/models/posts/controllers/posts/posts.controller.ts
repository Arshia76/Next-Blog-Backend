import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from 'src/models/posts/common/dto';
import { PostsServiceV1 } from 'src/models/posts/services/posts/posts.service';
import { OwnPostGuard } from 'src/models/posts/common/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessJwtAuthGuard } from 'src/models/auth/common/guards';

@Controller({ version: '1', path: 'posts' })
export class PostsControllerV1 {
  constructor(private readonly postServiceV1: PostsServiceV1) {}

  @Get('/')
  getAllPosts(@Query() { take, page }) {
    return this.postServiceV1.getAllPosts(take, page);
  }

  @Get('/:id')
  getPostDetail(@Param('id') id: string) {
    return this.postServiceV1.getPostDetail(id);
  }

  @Get('/category/:categoryId')
  getPostsOfCategory(
    @Param('categoryId') categoryId: string,
    @Query() { take, page },
  ) {
    return this.postServiceV1.getPostsOfCategory(categoryId, take, page);
  }

  @Get('/:userId/posts')
  @UseGuards(AccessJwtAuthGuard)
  getUserPosts(@Query() { take, page }) {
    return this.postServiceV1.getUserPosts(take, page);
  }

  @Get('/search/:post')
  searchPosts(@Param('post') post: string, @Query() { take, page }) {
    return this.postServiceV1.searchPosts(post, take, page);
  }

  @Get('/:userId/bookmarked/posts')
  @UseGuards(AccessJwtAuthGuard)
  getUserBookmarkedPosts(@Query() { take, page }) {
    return this.postServiceV1.getUserBookmarkedPosts(take, page);
  }

  @Patch('/bookmark/post/:postId')
  @UseGuards(AccessJwtAuthGuard)
  bookmarkPost(@Param('postId') postId: string) {
    this.postServiceV1.bookmarkPost(postId);
  }

  @Post('/upload')
  @UseGuards(AccessJwtAuthGuard)
  @UseInterceptors(FileInterceptor('postImage'))
  uploadPostImage(
    @UploadedFile()
    postImage: Express.Multer.File,
  ) {
    console.log(postImage);
  }

  @Post('/create/post')
  @UseGuards(AccessJwtAuthGuard)
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postServiceV1.createPost(createPostDto);
  }

  @Patch('/update/post/:id')
  @UseGuards(AccessJwtAuthGuard, OwnPostGuard)
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postServiceV1.updatePost(id, updatePostDto);
  }

  @Delete('/delete/post/:id')
  @UseGuards(AccessJwtAuthGuard, OwnPostGuard)
  deletePost(@Param('id') id: string) {
    return this.postServiceV1.deletePost(id);
  }

  @Post('/comment/:postId')
  @UseGuards(AccessJwtAuthGuard)
  commentPost(@Param('postId') postId: string, @Body('title') title: string) {
    return this.postServiceV1.commentPost(postId, title);
  }

  @Patch('/like/:postId')
  @UseGuards(AccessJwtAuthGuard)
  likePost(@Param('postId') postId: string) {
    return this.postServiceV1.likePost(postId);
  }

  @Patch('/unlike/:postId')
  @UseGuards(AccessJwtAuthGuard)
  unlikePost(@Param('postId') postId: string) {
    return this.postServiceV1.unlikePost(postId);
  }
}
