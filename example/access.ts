import { InitialState } from 'umi';

export default function accessFactory(initialState: InitialState) {
  console.log('InitialState is:', initialState);
  return {
    readArticle: true,
    updateArticle: () => false,
  };
}
