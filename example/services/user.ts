import { request } from 'umi';

export const fetchCurrentUser = () => {
  return request('/api/user');
};
