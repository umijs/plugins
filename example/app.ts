export function render(oldRender: Function) {
  oldRender();
}

// export function getInitialState() {
//   return {
//     name: 'test'
//   };
// }

export const layout = {
  logout: () => {
    console.log('logout success');
  }, // do something
};

export const locale = {
  default: 'zh-CN',
};
