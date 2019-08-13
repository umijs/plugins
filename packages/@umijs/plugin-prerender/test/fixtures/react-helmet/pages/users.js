/**
 * title: Users
 */
import React from 'react';
import { Helmet } from 'react-helmet';
const styles = {
  normal: 'normal___1KMnC',
};

function Page(props) {
  return (
    <div className={styles.normal}>
      <h1>Page users111</h1>
      <h2>users</h2>
      <Helmet>
        <title>Hello Umi SSR Helmet user title</title>
      </Helmet>
      <ul>
        {(props.list || []).map(user => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

Page.getInitialProps = () => {
  console.log('Users getInitialProps');
  return {
    list: ['foo', 'bar'],
  };
};

export default Page;
