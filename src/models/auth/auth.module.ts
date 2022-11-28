import { Module } from '@nestjs/common';
import { UsersModule } from 'src/models/users/users.module';
import { AuthServiceV1 } from './auth.service';
import { AuthControllerV1 } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenJwtStrategy } from './strategy';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthServiceV1, AccessTokenJwtStrategy],
  controllers: [AuthControllerV1],
})
export class AuthModule {}
