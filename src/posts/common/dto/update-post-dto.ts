import { IsString, IsUUID } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUUID()
  category: string;

  @IsString()
  image: string;
}
