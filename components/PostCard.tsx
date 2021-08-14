import Link from 'next/link';

interface Props {
  post: IPost;
}

export const PostCard = ({ post }: Props) => {
  return (
    <>
      <article>
        <time>{post.date}</time>
        <div>
          <h1>
            <Link href={`/posts/${post.slug}`}>
              <a>./{post.title}</a>
            </Link>
          </h1>
        </div>
      </article>
      <style jsx>{`
        article {
          display: flex;
          flex-flow: row;
        }

        h1 {
          margin: 0;
          padding: 0;
          font-weight: 400;
        }

        time {
          margin-top: 0.25rem;
          margin-right: 2rem;
          font-style: italic;
        }
      `}</style>
    </>
  );
};
