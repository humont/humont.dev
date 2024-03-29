import Link from 'next/link';
import { CategoryEmoji } from './CategoryEmoji';

interface Props {
  post: IPost;
}

export const PostCard = ({ post }: Props) => {
  return (
    <>
      <article>
        <time>{post.date}</time>
        <div className='title-container'>
          <h1>
            <Link href={`/notes/${post.slug}`}>
              <a>./{post.title}</a>
            </Link>
          </h1>
          <div className='tags'>
            {post.category?.map((c, i) => (
              <span key={`${post.slug}-${c}-${i}`}>
                {c}
                <CategoryEmoji category={c} />
              </span>
            ))}
          </div>
        </div>
      </article>
      <style jsx>{`
        article {
          display: flex;
          flex-flow: column;
        }

        @media screen and (min-width: 800px) {
          article {
            flex-flow: row;
          }
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
          white-space: nowrap;
        }

        .title-container {
          display: flex;
          flex-flow: column;
          white-space: break-spaces;
        }

        .tags {
          font-size: smaller;
          font-style: italic;
          opacity: 0.8;
        }

        .tags span:not(:last-child)::after {
          content: ', ';
        }
      `}</style>
    </>
  );
};
