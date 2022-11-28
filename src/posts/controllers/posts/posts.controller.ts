import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from 'src/posts/common/dto';
import { PostsServiceV1 } from 'src/posts/services/posts/posts.service';
import { OwnPostGuard } from 'src/posts/common/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessJwtAuthGuard } from 'src/auth/common/guards';

@Controller({ version: '1', path: 'posts' })
export class PostsControllerV1 {
  constructor(private readonly postServiceV1: PostsServiceV1) {}

  @Get('/')
  getAllPosts() {
    return this.postServiceV1.getAllPosts();
  }

  @Get('/:id')
  getPostDetail(@Param('id') id: string) {
    return this.postServiceV1.getPostDetail(id);
  }

  @Get('/category/:categoryId')
  getPostsOfCategory(@Param('categoryId') categoryId: string) {
    return this.postServiceV1.getPostsOfCategory(categoryId);
  }

  @Get('/:userId/posts')
  getUserPosts() {
    return this.postServiceV1.getUserPosts();
  }

  @Get('/search/:post')
  searchPosts(@Param('post') post: string) {
    return this.postServiceV1.searchPosts(post);
  }

  @Get('/:userId/bookmarked/posts')
  getUserBookmarkedPosts() {
    return this.postServiceV1.getUserBookmarkedPosts();
  }

  @Patch('/bookmark/post/:postId')
  @UseGuards(AccessJwtAuthGuard)
  bookmarkPost(@Param('postId') postId: string) {
    this.postServiceV1.bookmarkPost(postId);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('postImage'))
  uploadPostImage(
    @UploadedFile()
    postImage: Express.Multer.File,
  ) {
    console.log(postImage);
  }

  @Post('/create/post')
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postServiceV1.createPost(createPostDto);
  }

  @Patch('/update/post/:id')
  @UseGuards(OwnPostGuard)
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postServiceV1.updatePost(id, updatePostDto);
  }

  @Delete('/delete/post/:id')
  @UseGuards(OwnPostGuard)
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
