import { fireEvent, render, screen } from '@testing-library/react';
import BookForm from './BookForm';

function renderForm(props = {}) {
  const onSubmit = vi.fn();
  const onCancelEdit = vi.fn();

  render(
    <BookForm
      onSubmit={onSubmit}
      editingBook={null}
      onCancelEdit={onCancelEdit}
      {...props}
    />,
  );

  return { onSubmit, onCancelEdit };
}

describe('Komponen BookForm', () => {
  test('menampilkan pesan error jika judul dan penulis kosong', () => {
    const { onSubmit } = renderForm();

    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Judul dan nama penulis wajib diisi.',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('mengirim data buku baru saat semua kolom terisi', () => {
    const { onSubmit } = renderForm();

    fireEvent.change(screen.getByLabelText('Judul Buku'), {
      target: { value: '  Bumi Manusia  ' },
    });
    fireEvent.change(screen.getByLabelText('Nama Penulis'), {
      target: { value: 'Pramoedya Ananta Toer' },
    });
    fireEvent.change(screen.getByLabelText('Status Buku'), {
      target: { value: 'beli' },
    });
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Bumi Manusia',
      author: 'Pramoedya Ananta Toer',
      status: 'beli',
    });
  });

  test('mengisi form otomatis saat mode edit', () => {
    renderForm({
      editingBook: {
        id: 7,
        title: 'Laskar Pelangi',
        author: 'Andrea Hirata',
        status: 'baca',
      },
    });

    expect(screen.getByLabelText('Judul Buku')).toHaveValue('Laskar Pelangi');
    expect(screen.getByLabelText('Nama Penulis')).toHaveValue('Andrea Hirata');
    expect(screen.getByLabelText('Status Buku')).toHaveValue('baca');
    expect(screen.getByRole('button', { name: /simpan perubahan/i })).toBeInTheDocument();
  });
});
