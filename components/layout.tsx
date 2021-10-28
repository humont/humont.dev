import { FunctionComponent } from 'react';
import Link from 'next/link';

export const Layout: FunctionComponent<{}> = (props) => {
  return (
    <>
      <header className=''>
        <h1>~/HuMont.dev</h1>
        <nav>
          <Link href='/'>
            <a>./About</a>
          </Link>
          {/* <Link href='/projects'>
            <a>./Projects</a>
          </Link> */}
          <Link href='/posts'>
            <a>./Posts</a>
          </Link>
          <Link href='/rss/feed.xml'>
            <a>RSS</a>
          </Link>
        </nav>
      </header>

      <main className=''>{props.children}</main>
      <footer className=''></footer>

      <style jsx>
        {`
          header {
            display: flex;
            flex-flow: row wrap;
            padding: 4rem 0;
          }

          nav {
            margin-top: auto;
            display: flex;
            flex-flow: column;
            width: 100%;
          }

          nav a {
            width: 100%;
            text-align: center;
          }

          nav > * + * {
            margin-top: 1rem;
          }

          h1 {
            font-size: 2.5rem;
            font-weight: lighter;
            letter-spacing: 1;
            padding: 0;
            margin-top: auto;
            margin-bottom: 1rem;
            line-height: 0.6;
            text-align: center;
            width: 100%;
          }

          @media screen and (min-width: 800px) {
            header {
            }

            h1 {
              font-size: 4rem;
              margin-bottom: 0;
              width: auto;
            }

            nav {
              flex-flow: row;
              width: min-content;
              margin-left: auto;
            }

            nav > * + * {
              margin-top: 0;
              margin-left: 1.5rem;
            }

            nav a {
              width: auto;
            }
          }
        `}
      </style>
    </>
  );
};
