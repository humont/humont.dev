import { FunctionComponent } from 'react';

export const Layout: FunctionComponent<{}> = (props) => {
  return (
    <>
      <header>
        <h1>HuMont.dev</h1>
      </header>
      <nav>
        <a href='/'>Home</a>
      </nav>
      <main>{props.children}</main>
      <footer></footer>
    </>
  );
};
