
export default async function ({ getByTestId, getByText, fireEvent }) {
  expect(getByTestId('count').innerHTML).toEqual('0');
  fireEvent.click(getByText('add'));
  fireEvent.click(getByText('add'));
  expect(getByTestId('count').innerHTML).toEqual('2');
  fireEvent.click(getByText('minus'));
  expect(getByTestId('count').innerHTML).toEqual('1');
  fireEvent.click(getByText('minus'));
  expect(getByTestId('count').innerHTML).toEqual('0');
  fireEvent.click(getByText('minus'));
  expect(getByTestId('count').innerHTML).toEqual('-1');
}
