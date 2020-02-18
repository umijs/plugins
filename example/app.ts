export function render(oldRender: Function) {
  oldRender();
}

// export function getInitialState() {
//   return {
//     name: 'test'
//   };
// }

// export const layout = {
//   logout: () => {
//     console.log('logout success');
//   }, // do something
// };

export const locale = {
  default: 'zh-CN',
};

// export const getInitialState = async () => {
//   const mockService = () =>
//     new Promise<{ email: string; name: string }>(res =>
//       setTimeout(() => {
//         res({
//           name: 'troy',
//           email: 'troy.lty@alipay.com',
//         });
//       }, 300),
//     );
//   const userInfo = await mockService();

//   return {
//     avatar: `avatarUrl`,
//     gender: 'male',
//     ...userInfo,
//   };
// };
