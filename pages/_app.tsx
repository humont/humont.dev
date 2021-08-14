import { AppProps } from 'next/dist/shared/lib/router/router';
import { Layout } from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <style jsx global>{`
        :root {
          --bg-color: #f1f5f9;
          --link-color: #db2777;
          --link-color-hover: #831843;
          --font-color: #1e293b;
          --code-bg: #64748b;
          --highlight-color: #fefce8;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-color: #1e293b;
            --link-color: #ec4899;
            --link-color-hover: #fbcfe8;
            --font-color: #f8fafc;
            --code-bg: #0f172a;
            --highlight-color: #713f12;
          }
        }

        html {
          font-size: 100%;
          background-color: var(--bg-color);
          line-height: 2;
          letter-spacing: 1.2px;
          color: var(--font-color);
        }

        body {
          font-family: 'Courier New', Courier, monospace;
          font-weight: 400;
          padding: 0;
          margin: 0;
        }

        #__next {
          max-width: 1000px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          padding: 1rem;
        }

        #__next > * {
          max-width: 100%;
        }

        ul {
          padding-left: 1rem;
        }

        a {
          color: var(--link-color);
        }

        a:hover {
          color: var(--link-color-hover);
        }

        pre {
          max-width: 100%;
          overflow-x: scroll;
        }

        pre > code {
          width: 100%;
        }

        code {
          display: inline-block;
          background-color: var(--code-bg);
          color: white;
          border-radius: 5px;
          padding-left: 0.25rem;
          padding-right: 0.25rem;
        }

        .space-y > * + * {
          padding-bottom: 1rem;
        }
      `}</style>
    </>
  );
}

export default MyApp;
