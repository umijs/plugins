export default (
  modelPath: string,
) => `import { InitialState as InitialStateType } from '../${modelPath}';

export type InitialState = InitialStateType;
`;
