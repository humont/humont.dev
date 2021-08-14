import { FC } from 'react';
import { PostCard } from './PostCard';

interface Props {
  posts: Array<IPost>;
}

export const Posts: FC<Props> = ({ children, posts }) => {
  return (
    <>
      <ul>
        {posts.map((post, i) => (
          <li key={`posts_${i}`}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <style jsx>{`
        ul {
          list-style: none;
          padding: 0;
        }
        ul > * + * {
          margin-top: 2rem;
        }
      `}</style>
    </>
  );
};
