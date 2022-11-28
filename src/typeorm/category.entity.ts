import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
