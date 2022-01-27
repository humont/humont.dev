import { GetStaticProps, NextPage } from 'next';
import { getAllPosts } from '../../lib/api';
import { Posts } from '../../components/Posts';
import Head from 'next/head';

interface Props {
  allArticles: IPost[];
}

export const config = {
  unstable_runtimeJS: false,
};

export const ArticlesIndex = ({ allArticles: allPosts }: Props) => {
  return (
    <>
      <Head>
        <title>HuMont | Articles</title>
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
        <h1>Articles</h1>
        <Posts posts={allPosts} />
      </article>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: Props;
}> => {
  const allArticles: IPost[] = getAllPosts(
    ['title', 'date', 'slug', 'category', 'type'],
    true,
    'article'
  );

  return {
    props: { allArticles: allArticles },
  };
};

export default ArticlesIndex;
