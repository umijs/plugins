export const qiankun = {
  // 应用 render 之前触发
  async update(props) {
    console.log('app1 update', props);
  },
};
