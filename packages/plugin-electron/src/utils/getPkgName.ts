export const getPkgName = (depName: string): string | undefined => {
  let finalDepName = depName;
  if (depName.startsWith('.')) {
    // exp: ../node_modules/foo/utils
    if (!depName.includes('node_modules')) {
      return;
    }
    finalDepName = depName.slice(
      depName.indexOf('node_modules') + 'node_modules'.length + 1,
    );
  }

  if (finalDepName.startsWith('@')) {
    finalDepName = finalDepName.split('/').slice(0, 2).join('/');
  } else {
    finalDepName = finalDepName.split('/')[0];
  }
  return finalDepName;
};
