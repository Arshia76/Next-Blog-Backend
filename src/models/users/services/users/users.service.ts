import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm';
import { CreateUserDto, UpdateUserDto } from '../../common/dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersServiceV1 {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async find(query?: any) {
    if (query) {
      const user = await this.usersRepository.findOne({
        where: [query],
        relations: ['posts'],
      });
      // eslint-disable-next-line
      const { password, ...data } = user;
      const plainUser = instanceToPlain(data);

      return plainUser;
    } else {
      const users = await this.usersRepository.find({ relations: ['posts'] });
      const plainUser = instanceToPlain(users);
      return plainUser;
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    const plainUser = instanceToPlain(user);
    return plainUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.update({ id }, updateUserDto);
    const plainUser = instanceToPlain(user);
    return plainUser;
  }
}
