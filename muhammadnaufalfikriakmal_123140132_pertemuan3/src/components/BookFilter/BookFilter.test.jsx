import { fireEvent, render, screen } from '@testing-library/react';
import BookFilter from './BookFilter';

function renderFilter(props = {}) {
  const onFilterChange = vi.fn();
  const onSearchChange = vi.fn();

  render(
    <BookFilter
      filter="semua"
      search=""
      onFilterChange={onFilterChange}
      onSearchChange={onSearchChange}
      {...props}
    />,
  );

  return { onFilterChange, onSearchChange };
}

describe('Komponen BookFilter', () => {
  test('memanggil onFilterChange saat tombol status diklik', () => {
    const { onFilterChange } = renderFilter();

    fireEvent.click(screen.getByRole('button', { name: 'Ingin Dibeli' }));

    expect(onFilterChange).toHaveBeenCalledWith('beli');
  });

  test('memanggil onSearchChange saat pengguna mengetik', () => {
    const { onSearchChange } = renderFilter();

    fireEvent.change(screen.getByLabelText('Cari buku'), {
      target: { value: 'andrea' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('andrea');
  });
});
