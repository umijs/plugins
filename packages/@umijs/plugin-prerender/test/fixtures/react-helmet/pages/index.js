import React from 'react';
import { Helmet } from 'react-helmet';

const styles = {
  normal: 'normal___1KW4T',
};

function Page(props) {
  return (
    <div className={styles.normal}>
      <Helmet>
        <title>Hello Umi SSR Helmet Home title</title>
      </Helmet>
      <h1>Page index {window.context.siteName}</h1>
      <h2>csr: {props.data && props.data.csr}</h2>
    </div>
  );
}

Page.getInitialProps = () => {
  console.log('Home getInitialProps');
  return {
    data: {
      ssr: 'http://127.0.0.1:7001',
      csr: 'http://127.0.0.1:8000',
    },
  };
};

export default Page;
