import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post, User, Comment, Like as LikeModel } from 'src/typeorm';
import { CreatePostDto, UpdatePostDto } from 'src/models/posts/common/dto';
import { instanceToPlain } from 'class-transformer';
import { REQUEST } from '@nestjs/core';
import paginateResponse from 'src/utils/paginateResponse';
import { deleteFile } from 'src/utils/functions';

@Injectable()
export class PostsServiceV1 {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Comment)
    private commnetsRepository: Repository<Comment>,
    @InjectRepository(LikeModel)
    private likesRepository: Repository<LikeModel>,
    @Inject(REQUEST) private request: any,
  ) {}

  async getAllPosts(take: number, page: number) {
    const data = await this.postsRepository.findAndCount({
      relations: ['comments.user', 'likes.user'],
      take,
      skip: this.request.query.skip,
    });
    return paginateResponse(data, page, take);
  }

  getPostDetail(id: string) {
    return this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['comments.user', 'likes.user'],
    });
  }

  async getPostsOfCategory(categoryId: string, take: number, page: number) {
    const data = await this.postsRepository.findAndCount({
      where: {
        category: {
          id: categoryId,
        },
      },
      relations: ['comments.user', 'likes.user'],
      take,
      skip: this.request.query.skip,
    });
    return paginateResponse(data, page, take);
  }

  async getUserPosts(take: number, page: number) {
    const data = await this.postsRepository.findAndCount({
      where: {
        creator: {
          id: this.request.user.sub,
        },
      },
      relations: ['comments.user', 'likes.user'],
      take,
      skip: this.request.query.skip,
    });
    return paginateResponse(data, page, take);
  }

  async searchPosts(post: string, take: number, page: number) {
    const data = await this.postsRepository.findAndCount({
      where: {
        title: Like('%' + post + '%'),
      },
      relations: ['comments.user', 'likes.user'],
      take,
      skip: this.request.query.skip,
    });
    return paginateResponse(data, page, take);
  }

  async getUserBookmarkedPosts(take: number, page: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: this.request.user.sub,
      },
    });

    const data = await this.postsRepository.findAndCount({
      relations: ['comments.user', 'likes.user'],
      where: {
        bookmarkedByUsers: {
          id: user.id.toString(),
        },
      },
      take,
      skip: this.request.query.skip,
    });

    return paginateResponse(data, page, take);
  }

  async handleBookmarkPost(postId: string) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['likes.user'],
    });

    const user = await this.usersRepository.findOneBy({
      id: this.request.user.sub,
    });

    const isBookmarked = post.bookmarkedByUsers.find((u) => {
      console.log(u.id);
      console.log(user.id);
      return u?.id?.toString() === user.id.toString();
    });

    console.log(isBookmarked);

    if (isBookmarked) {
      const index = post.bookmarkedByUsers.indexOf(isBookmarked);
      if (index > -1) {
        post.bookmarkedByUsers.splice(index, 1);
      }
      await this.usersRepository.save(user);
      await this.postsRepository.save(post);
      return post;
    }

    post.bookmarkedByUsers.push(user);

    await this.postsRepository.save(post);

    return post;
  }

  async createPost(data: CreatePostDto) {
    const plainData = instanceToPlain(data);
    const user = await this.usersRepository.findOneBy({
      id: this.request.user.id,
    });

    plainData.creator = user;

    const post = this.postsRepository.create(plainData);
    user?.posts?.push(post);
    await this.usersRepository.save(user);

    return this.postsRepository.save(post);
  }

  async updatePost(id: string, data: UpdatePostDto) {
    const post = await this.postsRepository.findOneBy({ id });

    const plainPost = instanceToPlain(post);

    const plainData = instanceToPlain(data);

    return this.postsRepository.save({
      ...plainPost,
      ...plainData,
    });
  }

  deletePost(id: string) {
    return this.postsRepository.delete({ id });
  }

  async commentPost(postId: string, title: string) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['comments'],
    });
    const user = await this.usersRepository.findOneBy({
      id: this.request.user.sub,
    });

    const plainPost = instanceToPlain(post);
    const plainUser = instanceToPlain(user);

    const isCommented = post.comments.some(
      (comment) => comment?.user?.id === user?.id,
    );

    if (isCommented) {
      throw new HttpException("You've already commented", 400);
    }

    const comment = new Comment();
    comment.title = title;
    comment.user = plainUser.id;
    comment.post = plainPost.id;
    await this.commnetsRepository.save(comment);

    post.comments.push(comment);

    user?.comments?.push(comment);
    await this.usersRepository.save(user);
    await this.postsRepository.save(post);
    console.log(post);

    return post;
  }

  async handleLikePost(postId: string) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
      relations: ['likes.user'],
    });
    const user = await this.usersRepository.findOneBy({
      id: this.request.user.sub,
    });
    const plainUser = instanceToPlain(user);
    const plainPost = instanceToPlain(post);

    console.log(post.likes);

    const isLiked = post.likes.find((like: any) => like?.user?.id === user?.id);

    if (isLiked) {
      const index = post.likes.indexOf(isLiked);
      if (index > -1) {
        post.likes.splice(index, 1);
      }
      await this.usersRepository.save(user);
      await this.postsRepository.save(post);
      return post;
    }

    const like = new LikeModel();
    like.post = plainPost.id;
    like.user = plainUser.id;
    await this.likesRepository.save(like);
    post.likes.push(like);
    user?.likes?.push(like);
    await this.postsRepository.save(post);
    await this.likesRepository.save(user);
    return post;
  }

  async updatePostImage(postImage: Express.Multer.File, id: string) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (post.image) {
      deleteFile('./' + post.image);
    }

    const { path } = postImage;

    post.image = path;
    await this.postsRepository.save(post);
    return post;
  }
}
