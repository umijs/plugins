import React from 'react';
import Helmet from 'react-helmet';
const styles = {
  normal: 'normal___1KMnC',
};

function Page(props) {
  return (
    <div className={styles.normal}>
      <h1>Page users111</h1>
      <h2>users</h2>
      <Helmet>
        <title>React Helmet Users index</title>
        <meta name="description" content="React Helmet title Users description" />
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
