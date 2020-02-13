import { join } from 'path';

export const DIR_NAME = 'plugin-initial-state';
export const MODEL_NAME = 'initialState';
export const RELATIVE_MODEL = join(DIR_NAME, 'models', MODEL_NAME);
export const RELATIVE_MODEL_PATH = `${RELATIVE_MODEL}.ts`;
export const RELATIVE_EXPORT = join(DIR_NAME, 'exports');
export const RELATIVE_EXPORT_PATH = `${RELATIVE_EXPORT}.ts`;
