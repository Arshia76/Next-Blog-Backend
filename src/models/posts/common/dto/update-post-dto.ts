import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  category: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image: string;
}
