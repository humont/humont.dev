import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import MarkdownComponents from '../../components/MarkdownComponents';
import { getAllPosts, getPostBySlug } from '../../lib/api';

export const config = {
  unstable_runtimeJS: false,
};

interface Props {
  post: IPost;
}

export default function Post({ post }: Props) {
  return (
    <>
      <Head>
        <title>HuMont | {post.title}</title>
        <meta name='description' content={post.title} key='desc' />
        <meta property='og:title' content={post.title} />
        <meta property='og:description' content={post.title} />
        <meta
          property='og:image'
          content='https://humont.dev/favicon-32x32.png'
        />
      </Head>
      <article>
        <ReactMarkdown components={MarkdownComponents}>
          {post.content}
        </ReactMarkdown>
      </article>
      <style jsx>{`
        article {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        :global(img) {
          max-width: 80%;
          display: block;
          margin-left: auto;
          margin-right: auto;
          align-self: center;
          padding-top: 1em;
          padding-bottom: 1em;
        }
      `}</style>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<{ props: Props }> => {
  const post: IPost = getPostBySlug(params?.slug as string, [
    'title',
    'date',
    'slug',
    'content',
  ]);

  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};
