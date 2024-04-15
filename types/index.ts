interface User {
  id: number;
  userIP: string;
  username: string;
  nickname: string | null;
  password: string;
  email: string;
  avatar: string | null;
  registrationTime: Date;
  birthday: Date | null;
  age: number | null;
  phoneNumber: string | null;
}

interface Post {
  id: number;
  postDate: Date;
  userId: number;
  title: string;
  content: string;
  likes: number;
  replies: number;
  views: number;
}

interface Comment {
  id: number;
  commentDate: Date;
  likes: number;
  userId: number;
  postId: number;
  parentCommentId: number | null;
  content: string;
}

interface Category {
  id: number;
  categoryName: string;
  categoryAlias: string | null;
  categoryDescription: string | null;
  parentCategoryId: number | null;
}

interface Tag {
  id: number;
  tagName: string;
  tagAlias: string | null;
  tagDescription: string | null;
}

interface PostCategory {
  postId: number;
  categoryId: number;
}

interface PostTag {
  postId: number;
  tagId: number;
}
