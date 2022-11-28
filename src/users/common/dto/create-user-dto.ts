import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IR')
  phoneNumber: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
