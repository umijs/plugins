import React from 'react';
import DocumentTitle from 'react-document-title';
const styles = {
  normal: 'normal___1KMnC',
};

function Page(props) {
  return (
    <div className={styles.normal}>
      <h1>Page users111</h1>
      <h2>users</h2>
      <DocumentTitle title="Hello Umi SSR Helmet user title" />
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
