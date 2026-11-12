import { fireEvent, render, screen } from '@testing-library/react';
import BookList from './BookList';

const dummyBooks = [
  {
    id: 1,
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    status: 'milik',
  },
  {
    id: 2,
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    status: 'baca',
  },
];

describe('Komponen BookList', () => {
  test('menampilkan judul, penulis, dan status buku', () => {
    render(<BookList books={dummyBooks} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument();
    expect(screen.getByText(/Pramoedya Ananta Toer/)).toBeInTheDocument();
    expect(screen.getByText('Milik')).toBeInTheDocument();
    expect(screen.getByText('Sedang Dibaca')).toBeInTheDocument();
  });

  test('memanggil onEdit dan onDelete dengan data yang benar', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(<BookList books={dummyBooks} onEdit={onEdit} onDelete={onDelete} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Hapus' })[1]);

    expect(onEdit).toHaveBeenCalledWith(dummyBooks[0]);
    expect(onDelete).toHaveBeenCalledWith(2);
  });

  test('menampilkan pesan kosong jika daftar buku kosong', () => {
    render(<BookList books={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/Belum ada buku yang ditampilkan/i)).toBeInTheDocument();
  });
});
