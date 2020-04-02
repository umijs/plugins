export default async function ({ getByTestId, getByText, fireEvent, waitForDomChange }) {
  await waitForDomChange();
  expect(getByTestId('content').innerHTML).toEqual('hello world');
  fireEvent.click(getByText('set'));
  expect(getByTestId('content').innerHTML).toEqual('custom message');
}
