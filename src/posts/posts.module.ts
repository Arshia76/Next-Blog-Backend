import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Post, User, Comment, Like } from 'src/typeorm';
import { PostsControllerV1 } from './controllers/posts/posts.controller';
import { PostsServiceV1 } from './services/posts/posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, User, Comment, Like]),
    MulterModule.register({
      dest: './uploads/posts',
    }),
  ],
  controllers: [PostsControllerV1],
  providers: [PostsServiceV1],
})
export class PostsModule {}
