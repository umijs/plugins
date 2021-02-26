
export default async function ({ getByTestId, getByText, fireEvent, context }) {
  expect(getByTestId('message1').innerHTML).toEqual('this is user-hook');
  expect(getByTestId('message2').innerHTML).toEqual('this is 权限');
  expect(getByTestId('message3').innerHTML).toEqual('this is counter`hook-backup@1.0');
  expect(getByTestId('message4').innerHTML).toEqual('this is umi\'s hook');
}
