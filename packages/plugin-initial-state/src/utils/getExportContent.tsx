import { utils } from 'umi';
const { winPath } = utils;

export default (
  modelPath: string,
) => `import { InitialState as InitialStateType } from '${winPath(
  `../${modelPath}`,
)}';

export type InitialState = InitialStateType;
export const __PLUGIN_INITIAL_STATE = 1;
`;
