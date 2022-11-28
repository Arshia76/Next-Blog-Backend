import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post, User, Category, Comment, Like as LikeModel } from 'src/typeorm';
import { CreatePostDto, UpdatePostDto } from 'src/posts/common/dto';
import { instanceToPlain } from 'class-transformer';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class PostsServiceV1 {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Comment)
    private commnetsRepository: Repository<Comment>,
    @InjectRepository(LikeModel)
    private likesRepository: Repository<LikeModel>,
    @Inject(REQUEST) private request: any,
  ) {}

  getAllPosts() {
    return this.postsRepository.find({
      relations: ['comments.user', 'likes.user'],
    });
  }

  getPostDetail(id: string) {
    return this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['comments.user', 'likes.user'],
    });
  }

  async getPostsOfCategory(categoryId: string) {
    const category = await this.categoriesRepository.findOneBy({
      id: categoryId,
    });

    return this.postsRepository.find({
      where: {
        category,
      },
      relations: ['comments.user', 'likes.user'],
    });
  }

  getUserPosts() {
    return this.postsRepository.find({
      where: {
        creator: this.request.user,
      },
      relations: ['comments.user', 'likes.user'],
    });
  }

  searchPosts(post: string) {
    return this.postsRepository.find({
      where: {
        title: Like(post),
      },
      relations: ['comments.user', 'likes.user'],
    });
  }

  getUserBookmarkedPosts() {
    return this.postsRepository.find({
      where: {
        creator: this.request.user,
      },
      relations: ['comments.user', 'likes.user'],
    });
  }

  async bookmarkPost(postId: string) {
    const post = await this.postsRepository.findOneBy({ id: postId });
    console.log(post);

    const user = await this.usersRepository.findOneBy({
      id: this.request.user.sub,
    });
    console.log(user);

    post.bookmarkedByUsers.push(user);

    await this.postsRepository.save(post);
    console.log(post);

    return post;
  }

  async createPost(data: CreatePostDto) {
    const plainData = instanceToPlain(data);
    const user = await this.usersRepository.findOneBy({
      id: this.request.user.id,
    });

    const post = this.postsRepository.create(plainData);
    user.posts.push(post);
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
    const post = await this.postsRepository.findOneBy({ id: postId });
    const user = await this.usersRepository.findOneBy({
      id: this.request.user.sub,
    });

    const plainPost = instanceToPlain(post);
    const plainUser = instanceToPlain(user);

    console.log(post);

    console.log(plainPost);

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

  async likePost(postId: string) {
    const post = await this.postsRepository.findOneBy({ id: postId });
    const user = await this.usersRepository.findOneBy({
      id: this.request.user.sub,
    });
    const plainUser = instanceToPlain(user);
    const plainPost = instanceToPlain(post);
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

  async unlikePost(postId: string) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
      relations: ['likes.user'],
    });
    const currentUser = await this.usersRepository.findOneBy({
      id: this.request.user.sub,
    });

    const plainUser = instanceToPlain(currentUser);

    const isLiked = post.likes.find(
      (like: LikeModel) => like.user.id?.toString() === plainUser.id.toString(),
    );

    if (!isLiked) {
      return new HttpException('You havent liked this post yet', 400);
    }
    await this.likesRepository.remove(isLiked);

    const index = post.likes.indexOf(isLiked);
    if (index > -1) {
      post.likes.splice(index, 1);
    }
    await this.usersRepository.save(currentUser);
    await this.postsRepository.save(post);
    return post;
  }
}
