import React from 'react';
import { useAccess } from 'umi';

export default () => {
  const access = useAccess();
  if (access.updateArticle()) {
    return <div data-cy="access-text">you can update the article</div>;
  }
  return <div data-cy="no-access-text">no access</div>;
};
