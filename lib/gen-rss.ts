import { Feed } from 'feed';
import { getAllPosts } from './api';
import fs from 'fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse/lib';
import remarkHtml from 'remark-html';

export const generateRssFeed = async () => {
  const posts = await getAllPosts(
    ['category', 'content', 'date', 'slug', 'title'],
    true
  );

  const siteURL = 'https://humont.dev';
  const date = new Date();
  const author = {
    name: 'humont',
    email: 'hell@humont.dev',
    link: 'https://humont.dev',
  };

  const feed = new Feed({
    title: 'Humont.Dev',
    description: "Humont's blog about tech and health",
    id: siteURL,
    link: siteURL,
    image: `${siteURL}/favicon.ico`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, humont.dev`,
    updated: date,
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`,
      json: `${siteURL}/rss/feed.json`,
      atom: `${siteURL}/rss/atom.xml`,
    },
    author,
  });

  posts.forEach((post) => {
    const url = `${siteURL}/posts/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.title,
      content: unified()
        .use(remarkParse)
        .use(remarkHtml)
        .processSync(post.content)
        .toString(),
      author: [author],
      contributor: [author],
      date: new Date(post.date),
    });
  });

  fs.mkdirSync('./public/rss', { recursive: true });
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1());
  fs.writeFileSync('./public/rss/feed.json', feed.json1());
};
