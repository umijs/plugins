
export default async function ({ getByTestId }) {
  expect(getByTestId('dva').innerHTML).toEqual('undefined');
  expect(getByTestId('hook1').innerHTML).toEqual('hook1');
  expect(getByTestId('hook2').innerHTML).toEqual('hook2');
  expect(getByTestId('hook3').innerHTML).toEqual('hook3');
  expect(getByTestId('hook4').innerHTML).toEqual('hook4');
  expect(getByTestId('hook5').innerHTML).toEqual('hook5');
  expect(getByTestId('hook6').innerHTML).toEqual('hook6');
  expect(getByTestId('hook7').innerHTML).toEqual('undefined');
}
