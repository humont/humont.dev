import { GetStaticProps, NextPage } from 'next';
import { getAllPosts } from '../../lib/api';
import { Posts } from '../../components/Posts';
import Head from 'next/head';

interface Props {
  allNotes: IPost[];
}

export const config = {
  unstable_runtimeJS: false,
};

export const PostsIndex = ({ allNotes }: Props) => {
  return (
    <>
      <Head>
        <title>HuMont | Notes</title>
        <meta
          name='description'
          content="Humont's blog about tech and health"
          key='desc'
        />
        <meta property='og:title' content={'Humont.dev'} />
        <meta
          property='og:description'
          content={"Humont's blog about tech and health"}
        />
        <meta
          property='og:image'
          content='https://humont.dev/favicon-32x32.png'
        />
      </Head>
      <article>
        <h1>Notes</h1>
        <Posts posts={allNotes} />
      </article>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: Props;
}> => {
  const allNotes: IPost[] = getAllPosts(
    ['title', 'date', 'slug', 'category', 'type'],
    true,
    'note'
  );

  return {
    props: { allNotes },
  };
};

export default PostsIndex;
