import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const postsDirectory = join(process.cwd(), '_posts');

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: Array<keyof IPost>): IPost {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents, {});
  const typedData = data as NonNullable<IPost>;

  let post = {} as any;

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      post[field] = realSlug;
    }
    if (field === 'content') {
      post[field] = content;
    }

    if (!!typedData[field]) {
      post[field] = typedData[field];
    }
  });

  post.draft = !!typedData.draft;

  return post;
}

export function getAllPosts(
  fields: Array<keyof IPost> = [],
  filterDrafts: boolean = true,
  type?: IPost['type']
): IPost[] {
  const slugs = getPostSlugs();
  const posts: IPost[] = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .filter((post) => {
      if (filterDrafts) {
        return !post.draft;
      } else {
        return true;
      }
    })
    .filter((post) => {
      if (!!type) {
        return post.type === type;
      } else {
        return true;
      }
    })
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}
