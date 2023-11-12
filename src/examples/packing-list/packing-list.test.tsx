import { render as _render, screen, waitFor } from 'test/utilities';
import { PackingList } from '.';
import { createStore } from './store';
import { Provider } from 'react-redux';

const render = (ui: React.ReactElement) => {
  return _render(<Provider store={createStore()}>{ui}</Provider>);
};

it('renders the Packing List application', () => {
  render(<PackingList />);
});

it('has the correct title', async () => {
  render(<PackingList />);
  screen.getByText('Packing List');
});

it('has an input field for a new item', () => {
  render(<PackingList />);
  screen.getByLabelText('New Item Name');
});

it('has a "Add New Item" button that is disabled when the input is empty', () => {
  render(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });

  expect(input).toHaveValue('');
  expect(button).toBeDisabled();
});

it('enables the "Add New Item" button when there is text in the input field', async () => {
  const { user } = render(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });
  await user.type(input, 'Socks');

  expect(button).toBeEnabled();
});

it('adds a new item to the unpacked item list when the clicking "Add New Item"', async () => {
  const { user } = render(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });
  const list = screen.getByTestId('unpacked-items-list');
  await user.type(input, 'Socks');
  await user.click(button);

  expect(list).toHaveTextContent('Socks');
});

it('clears the input field when clicking "Add New Item"', async () => {
  const { user } = render(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });
  await user.type(input, 'Socks');
  await user.click(button);

  expect(input).toHaveValue('');
});

it('removes item', async () => {
  const { user } = render(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });
  await user.type(input, 'Socks');
  await user.click(button);

  screen.debug();

  const removeButtom = screen.getByLabelText(/remove/i);
  await user.click(removeButtom);

  await waitFor(() => {
    expect(screen.queryByText('Socks')).not.toBeInTheDocument();
  });
});
