import { HttpException, Injectable } from '@nestjs/common';
import { UsersServiceV1 } from 'src/models/users/services/users/users.service';
import { CreateUserDto, LoginUserDto } from './common/dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServiceV1 {
  constructor(
    private readonly userServiceV1: UsersServiceV1,
    private readonly jwtService: JwtService,
    readonly configService: ConfigService,
  ) {
    console.log(configService.get('JWT_SECRET_ACCESS_TOKEN'));
  }

  async localLogin(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.userServiceV1.find({
      username,
    });

    if (!user) {
      throw new HttpException('Wrong Cridentials', 400);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException('Wrong Cridentials', 400);
    }

    const payload = { username, sub: user.id };

    const data = {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET_ACCESS_TOKEN'),
        expiresIn: '1d',
      }),
    };

    return data;
  }

  async localRegister(createUserDto: CreateUserDto) {
    const { phoneNumber, username } = createUserDto;

    const userExist = await this.userServiceV1.find({ phoneNumber, username });

    if (userExist) {
      throw new HttpException('User Already Exists', 400);
    }

    const { password, ...rest } = createUserDto;
    const hashedPassword = await this.hash(password);
    const data = {
      ...rest,
      password: hashedPassword,
    };
    return this.userServiceV1.createUser(data);
  }

  async hash(data: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }
}
