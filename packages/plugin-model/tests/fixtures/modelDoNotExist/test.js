
export default async function ({ getByTestId }) {
  expect(getByTestId('useModel').innerHTML).toEqual('useModel is: undefined');
}
