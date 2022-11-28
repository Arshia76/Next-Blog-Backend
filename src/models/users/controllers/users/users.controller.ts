import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto, UpdateUserDto } from '../../common/dto';
import { UsersServiceV1 } from '../../services/users/users.service';

@Controller({ path: 'users', version: '1' })
export class UsersControllerV1 {
  constructor(private readonly usersServiceV1: UsersServiceV1) {}

  @Get('/')
  find(@Query() query?: any) {
    return this.usersServiceV1.find(query);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'jpeg' }),
          new FileTypeValidator({ fileType: 'jpg' }),
          new FileTypeValidator({ fileType: 'png' }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    console.log(avatar);
  }

  @Post('/create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersServiceV1.createUser(createUserDto);
  }

  @Patch('/update/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersServiceV1.updateUser(id, updateUserDto);
  }
}
