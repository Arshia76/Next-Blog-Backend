import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IR')
  phoneNumber: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
