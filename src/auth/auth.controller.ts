import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthServiceV1 } from './auth.service';
import { CreateUserDto, LoginUserDto } from './common/dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthControllerV1 {
  constructor(private readonly authServiceV1: AuthServiceV1) {}

  @Post('/localLogin')
  @HttpCode(200)
  localLogin(@Body() loginUserDto: LoginUserDto) {
    return this.authServiceV1.localLogin(loginUserDto);
  }

  @Post('/localRegister')
  localRegister(@Body() createUserDto: CreateUserDto) {
    return this.authServiceV1.localRegister(createUserDto);
  }
}
