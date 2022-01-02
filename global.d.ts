declare type PostCategory = Blockchain | Dev | Thoughts;

declare interface IPost {
  title: string;
  date: string;
  slug: string;
  content: string;
  category: Array<PostCategory>;
  draft?: boolean;
  type: 'note' | 'essay';
}
