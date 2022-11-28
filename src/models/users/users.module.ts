import { Module } from '@nestjs/common';
import { UsersControllerV1 } from './controllers/users/users.controller';
import { UsersServiceV1 } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersControllerV1],
  providers: [UsersServiceV1],
  exports: [UsersServiceV1],
})
export class UsersModule {}
