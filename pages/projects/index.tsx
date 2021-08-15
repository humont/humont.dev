import Head from 'next/head';

export const config = {
  unstable_runtimeJS: false,
};

export default function Projects() {
  return (
    <>
      <Head>
        <title>HuMont | Projects</title>
      </Head>
      <article>
        <h1>Projects</h1>
        <ul>
          <li>Project 1</li>
          <li>Project 2</li>
        </ul>
      </article>

      <style jsx>
        {`
          article {
          }

          article h1 {
            padding-bottom: 0.5rem;
            margin-bottom: 0;
            margin-top: 0;
            padding-top: 0;
            font-size: 2rem;
            font-weight: lighter;
          }

          article:nth-child(1n + 2) h1 {
            padding-top: 3rem;
          }

          @media screen and (min-width: 500px) {
            article {
              display: grid;
              grid-template-columns: 20% 1fr;
              position: relative;
              padding-top: 2rem;
              padding-bottom: 2rem;
            }
            article h1 {
              position: sticky;
              top: 0;
              margin-top: 0;
              padding-top: 0;
              padding-right: 2rem;
            }

            article:nth-child(1n + 2) h1 {
              padding-top: 0rem;
            }
          }

          dt {
            font-weight: bold;
          }
          dt:nth-child(1n + 2) {
            padding-top: 1rem;
          }
          dd {
            margin-left: 0;
            word-wrap: break-word;
          }
        `}
      </style>
    </>
  );
}
