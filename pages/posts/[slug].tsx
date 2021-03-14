import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getPostBySlug } from '../../lib/api';
import markdownToHtml from '../../lib/mdToHtml';
import { IPost } from '../../lib/type';

interface Props {
  post: IPost;
}

export default function Post({ post }: Props) {
  return (
    <article>
      <section dangerouslySetInnerHTML={{ __html: post.content }}></section>
    </article>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<{ props: Props }> => {
  const post: IPost = getPostBySlug(params.slug as string, [
    'title',
    'date',
    'slug',
    'content',
    'coverImage',
  ]);

  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
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
