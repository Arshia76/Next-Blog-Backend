import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../../common/dto';
import { UsersServiceV1 } from '../../services/users/users.service';

@Controller({ path: 'users', version: '1' })
export class UsersControllerV1 {
  constructor(private readonly usersServiceV1: UsersServiceV1) {}

  @Get('/')
  find(@Query() query?: any) {
    return this.usersServiceV1.find(query);
  }

  @Post('/create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersServiceV1.createUser(createUserDto);
  }

  @Patch('/update/:id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersServiceV1.updateUser(id, updateUserDto);
  }
}
