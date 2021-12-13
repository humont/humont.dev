import { AppProps } from 'next/dist/shared/lib/router/router';
import Head from 'next/head';
import { Layout } from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <style jsx global>{`
        :root {
          --bg-color: #f1f5f9;
          --link-color: #93174e;
          --link-color-hover: #ec4899;
          --font-color: #1e293b;
          --code-bg: #64748b;
          --highlight-color: #fefce8;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-color: #1e293b;
            --link-color: #fbcfe8;
            --link-color-hover: #ec4899;
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
          text-underline-offset: 1.5px;
        }

        body {
          font-family: 'Courier New', Courier, monospace;
          font-weight: 400;
          padding: 0;
          padding-bottom: 10rem;
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
          font-weight: 400;
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

        blockquote {
          background-color: var(--highlight-color);
          padding: 0.25rem 1rem;
          border-radius: 5px;
          font-style: italic;
        }

        blockquote > p:last-child > a:last-child {
          font-style: italic;
          font-size: smaller;
          opacity: 0.7;
        }

        .space-y > * + * {
          padding-bottom: 1rem;
        }
      `}</style>
    </>
  );
}

export default MyApp;
