import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Category } from './category.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
  })
  creator: User;

  @ManyToOne(() => Category, (category) => category.posts, {
    eager: true,
  })
  category: Category;

  @OneToMany(() => Like, (like) => like.post, {
    cascade: ['insert'],
    eager: true,
  })
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: ['insert'],
    eager: true,
  })
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.bookmarkedPosts, {
    eager: true,
  })
  bookmarkedByUsers: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
