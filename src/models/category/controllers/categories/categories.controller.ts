import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesServiceV1 } from '../../services/categories/categories.service';

@Controller({ version: '1', path: 'categories' })
export class CategoriesControllerV1 {
  constructor(private readonly categoryServiceV1: CategoriesServiceV1) {}

  @Get('/')
  getAllCategories() {
    return this.categoryServiceV1.getAllCategories();
  }

  @Post('/create')
  createCategory(@Body('title') title: string) {
    return this.categoryServiceV1.createCategory(title);
  }
}
