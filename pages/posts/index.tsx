import { GetStaticProps, NextPage } from 'next';
import { getAllPosts } from '../../lib/api';
import { Posts } from '../../components/Posts';
import Head from 'next/head';

interface Props {
  allPosts: IPost[];
}

export const config = {
  unstable_runtimeJS: false,
};

export const PostsIndex = ({ allPosts }: Props) => {
  return (
    <>
      <Head>
        <title>HuMont | Posts</title>
      </Head>
      <article>
        <h1>Posts</h1>
        <Posts posts={allPosts} />
      </article>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: Props;
}> => {
  const allPosts: IPost[] = getAllPosts(['title', 'date', 'slug'], true);

  return {
    props: { allPosts },
  };
};

export default PostsIndex;
