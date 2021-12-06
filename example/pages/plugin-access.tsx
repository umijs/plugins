import React from 'react';
import { useAccess } from 'umi';

export default () => {
  const access = useAccess();

  if (access.readArticle) {
    return <div data-cy="access-text">you can read the article</div>;
  }
  return <div>no access</div>;
};
