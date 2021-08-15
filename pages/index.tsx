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
        <p>
          Hi, I'm Hugo, a <em>software developer</em> based in the <em>UK</em>.
        </p>
        <p>
          I spent my 20's working in the fitness industry and running my start
          up - high quality gourmet protein company in Hong Kong. In 2018 I
          completed an <em>MSc in Advanced Computer Science</em>.
        </p>
        <p>
          My MSc focus was on <em>distrubuted computing</em>,{' '}
          <em>data privacy</em> and <em>ethics</em> (yes, that's a mix of
          technical and theoretical).
        </p>
        <p>
          Since then, I have been working mainly as a <em>web</em> based
          developer, creating web apps and sites with{' '}
          <em>payments infrastructures</em> (B2C and Marketplaces, proudcts and
          subscriptions).
        </p>
        <br />
        <h2>Stack</h2>
        <dl>
          <dt>Languages</dt>
          <dd>
            <ul>
              <li>JavaScript</li>
              <li>HTML</li>
              <li>CSS</li>
              <li>Java</li>
              <li>SQL</li>
              <li>GraphQL</li>
            </ul>
          </dd>
          <dt>Technologies</dt>
          <dd>
            <ul>
              <li>Node</li>
              <li>PostgreSQL</li>
              <li>React</li>
              <li>NextJS</li>
              <li>Hasura</li>
              <li>Apollo GraphQL</li>
              <li>Dokku</li>
              <li>Docker</li>
            </ul>
          </dd>
          <dt>Services</dt>
          <dd>
            <ul>
              <li>Stripe</li>
              <li>Heroku</li>
              <li>Netlify</li>
            </ul>
          </dd>
        </dl>
      </article>

      <style jsx>{`
        em {
          border-bottom: 1px solid black;
        }

        h2 {
          font-size: 1.25rem;
        }

        dl {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        dt {
          font-weight: 800;
        }

        dd,
        dt {
          border-top: 1px solid black;
          padding: 1rem 0;
          margin: 0;
        }
      `}</style>
    </>
  );
}
