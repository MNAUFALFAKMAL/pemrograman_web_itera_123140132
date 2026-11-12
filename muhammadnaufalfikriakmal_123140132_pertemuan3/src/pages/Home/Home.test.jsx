import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BookProvider } from '../../context/BookContext';
import Home from './Home';

function renderHome() {
  render(
    <MemoryRouter>
      <BookProvider>
        <Home />
      </BookProvider>
    </MemoryRouter>,
  );
}

describe('Halaman Home', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('menambahkan buku baru lewat form dan menampilkannya di daftar', () => {
    renderHome();

    fireEvent.change(screen.getByLabelText('Judul Buku'), {
      target: { value: 'Bumi Manusia' },
    });
    fireEvent.change(screen.getByLabelText('Nama Penulis'), {
      target: { value: 'Pramoedya Ananta Toer' },
    });
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument();
    expect(screen.getByText('Menampilkan 1 dari 1 buku')).toBeInTheDocument();
  });

  test('menyaring buku berdasarkan kata kunci pencarian', () => {
    localStorage.setItem(
      'buku_data',
      JSON.stringify([
        { id: 1, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', status: 'milik' },
        { id: 2, title: 'Laskar Pelangi', author: 'Andrea Hirata', status: 'baca' },
      ]),
    );

    renderHome();

    fireEvent.change(screen.getByLabelText('Cari buku'), {
      target: { value: 'laskar' },
    });

    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument();
    expect(screen.queryByText('Bumi Manusia')).not.toBeInTheDocument();
  });
});
