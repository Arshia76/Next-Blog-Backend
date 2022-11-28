import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/typeorm';

@Injectable()
export class OwnPostGuard implements CanActivate {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    const isOwnPost = await this.postsRepository.findOne({
      where: {
        creator: user,
      },
    });
    if (isOwnPost) {
      return true;
    }
    return false;
  }
}
