import { Controller, Post, Body, HttpCode, Header } from '@nestjs/common';
import { AuthServiceV1 } from './auth.service';
import { CreateUserDto, LoginUserDto } from './common/dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthControllerV1 {
  constructor(private readonly authServiceV1: AuthServiceV1) {}

  @Post('/localLogin')
  @Header('Content-Type', 'application/json')
  @Header('charset', 'utf-8')
  @HttpCode(200)
  localLogin(@Body() loginUserDto: LoginUserDto) {
    return this.authServiceV1.localLogin(loginUserDto);
  }

  @Post('/localRegister')
  @Header('Content-Type', 'application/json')
  @Header('charset', 'utf-8')
  localRegister(@Body() createUserDto: CreateUserDto) {
    return this.authServiceV1.localRegister(createUserDto);
  }
}
