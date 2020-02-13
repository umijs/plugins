
export default async function ({ getByTestId, getByText, fireEvent, context }) {
  expect(getByTestId('user').innerHTML).toEqual('Troy is an adult');
  expect(context.updateCount).toEqual(1);
  fireEvent.click(getByText(/changeGender/));
  expect(context.updateCount).toEqual(1);
  fireEvent.click(getByText(/increaseAge/));
  expect(context.updateCount).toEqual(2);
}
