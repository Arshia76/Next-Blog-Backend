import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm';
import { CreateUserDto, UpdateUserDto } from '../../common/dto';
import { instanceToPlain } from 'class-transformer';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UsersServiceV1 {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(REQUEST) private request: any,
  ) {}

  async find(query?: any) {
    if (query) {
      console.log(query);

      const user = await this.usersRepository.findOne({
        where: Array.isArray(query) ? [...query] : [query],
        select: ['avatar', 'id', 'password', 'username'],
        relations: ['posts'],
      });

      if (!user) {
        return null;
      }

      // eslint-disable-next-line
      const plainUser = instanceToPlain(user);

      return plainUser;
    } else {
      throw new HttpException('Please Provide the Query params', 400);
    }
  }

  async getCurrentUser() {
    const user = await this.usersRepository.findOne({
      where: {
        id: this.request.user.sub,
      },
    });
    const plainUser = instanceToPlain(user);
    return plainUser;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    const plainUser = instanceToPlain(user);
    // eslint-disable-next-line
    const { password, ...rest } = plainUser;
    return rest;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (user.id !== this.request.user.sub) {
      throw new ForbiddenException();
    }

    const plainData = instanceToPlain(updateUserDto);
    const plainUser = instanceToPlain(user);
    return this.usersRepository.save({
      ...plainUser,
      ...plainData,
    });
  }
}
