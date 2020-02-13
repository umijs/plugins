
export default async function ({ getByTestId }) {
  console.error = jest.fn();
  // expect(console.error).toHaveBeenCalledTimes(1);
  expect(getByTestId('count').innerHTML).toEqual('undefined');
}
