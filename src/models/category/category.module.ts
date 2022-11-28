import { Module } from '@nestjs/common';
import { CategoriesServiceV1 } from './services/categories/categories.service';
import { CategoriesControllerV1 } from './controllers/categories/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesServiceV1],
  controllers: [CategoriesControllerV1],
})
export class CategoryModule {}
