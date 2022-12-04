import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AccessJwtAuthGuard } from 'src/models/auth/common/guards';
import { CreateUserDto, UpdateUserDto } from '../../common/dto';
import { ChangePasswordDto } from '../../common/dto/change-password-dto';
import { UsersServiceV1 } from '../../services/users/users.service';

@Controller({ path: 'users', version: '1' })
export class UsersControllerV1 {
  constructor(private readonly usersServiceV1: UsersServiceV1) {}

  @Get('/')
  find(@Query() query?: any) {
    return this.usersServiceV1.find(query);
  }

  @Post('/upload')
  @UseGuards(AccessJwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: `./uploads/users/avatars`,
        filename(req, file, callback) {
          const filename =
            file.originalname + '-' + Date.now() + extname(file.originalname);
          callback(null, filename);
        },
      }),
    }),
  )
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)$' }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    return this.usersServiceV1.uploadAvatar(avatar);
  }

  @Get('me')
  @UseGuards(AccessJwtAuthGuard)
  getCurrentUser() {
    return this.usersServiceV1.getCurrentUser();
  }

  @Post('/create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersServiceV1.createUser(createUserDto);
  }

  @Patch('/update')
  @UseGuards(AccessJwtAuthGuard)
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersServiceV1.updateUser(updateUserDto);
  }

  @Patch('/update/avatar')
  @UseGuards(AccessJwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: `./uploads/users/avatars`,
        filename(req, file, callback) {
          const filename =
            file.originalname + '-' + Date.now() + extname(file.originalname);
          callback(null, filename);
        },
      }),
    }),
  )
  updateUserAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)$' }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    return this.usersServiceV1.updateUserAvatar(avatar);
  }

  @Patch('/changePassword')
  @UseGuards(AccessJwtAuthGuard)
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.usersServiceV1.changePassword(changePasswordDto);
  }
}
