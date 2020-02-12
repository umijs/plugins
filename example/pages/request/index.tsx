import React from 'react';
import { useRequest } from 'umi';
import * as services from '../../services';

export default () => {
  const { data, loading } = useRequest(services.fetchCurrentUser);

  if (loading) {
    return <div>loading...</div>;
  }

  return <div>{data.name}</div>;
};
