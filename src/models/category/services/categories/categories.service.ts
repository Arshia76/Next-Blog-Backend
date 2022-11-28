import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/typeorm';

@Injectable()
export class CategoriesServiceV1 {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  getAllCategories() {
    return this.categoriesRepository.find({
      relations: ['posts'],
    });
  }

  createCategory(title: string) {
    const category = this.categoriesRepository.create({ title });
    return this.categoriesRepository.save(category);
  }
}
