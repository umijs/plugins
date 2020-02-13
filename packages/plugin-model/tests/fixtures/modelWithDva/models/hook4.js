const dva = {
  state: {},
  reducer: {},
  effect: {},
};

function hook4 () {
  return dva.state.text || 'hook4';
};
export default hook4;
