import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllPosts } from '../lib/api';
import { IPost } from '../lib/type';
import { formatPostSlug } from '../lib/utils';

interface Props {
  allPosts: IPost[];
}
export default function Home({ allPosts }: Props) {
  return (
    <article>
      <ul>
        {allPosts.map((post) => (
          <li>
            <a href={formatPostSlug(post.slug)}>{post.title}</a>
          </li>
        ))}
      </ul>
    </article>
  );
}

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: Props;
}> => {
  const allPosts = getAllPosts(['title', 'date', 'slug']);
  return {
    props: { allPosts },
  };
};
