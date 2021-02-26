export default async function({ getByTestId, getByText, fireEvent }) {
  expect(getByTestId('message').innerHTML).toEqual('Hello admin');
  fireEvent.click(getByText('switch'));
  expect(getByTestId('message').innerHTML).toEqual('Hello user');
  fireEvent.click(getByText('switch'));
  expect(getByTestId('message').innerHTML).toEqual('Hello admin');
  expect(getByTestId('initial').innerHTML).toEqual('initialtest');
}
