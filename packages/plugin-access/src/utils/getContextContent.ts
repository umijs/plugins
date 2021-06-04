export default function (accessFactoryPath: string) {
  return `\
import React from 'react';
import accessFactory from '${accessFactoryPath}';

export type AccessInstance = ReturnType<typeof accessFactory>;

const AccessContext = React.createContext<AccessInstance>(null!);

export default AccessContext;
`;
}
