import { User } from './user.entity';
import { Post } from './post.entity';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

const entities = [User, Post, Category, Comment, Like];

export { User, Post, Category, Comment, Like };
export default entities;
