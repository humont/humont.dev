import Head from 'next/head';

export const config = {
  unstable_runtimeJS: false,
};

export default function Home() {
  return (
    <>
      <Head>
        <title>HuMont | About</title>
      </Head>
      <article>
        <h1>About</h1>
        <dl className=''>
          <dt>Who:</dt>
          <dd>Hugo</dd>
          <dt>What:</dt>
          <dd>Software developer, health & fitness enthusiast, avid reader</dd>
          <dt>Where:</dt>
          <dd>UK/EU</dd>
        </dl>
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
