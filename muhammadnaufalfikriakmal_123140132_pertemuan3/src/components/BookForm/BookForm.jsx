import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { STATUS_OPTIONS } from '../../utils/status';
import './BookForm.css';

/**
 * Form tambah & edit buku (controlled component).
 * Props:
 * - onSubmit      : dipanggil dengan { title, author, status }
 * - editingBook   : data buku yang sedang diedit (null jika mode tambah)
 * - onCancelEdit  : dipanggil saat tombol batal edit diklik
 */
function BookForm({ onSubmit, editingBook, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('milik');
  const [error, setError] = useState('');

  // Saat tombol Edit diklik di daftar buku, isi form dengan data buku tersebut.
  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setStatus(editingBook.status);
    } else {
      setTitle('');
      setAuthor('');
      setStatus('milik');
    }
    setError('');
  }, [editingBook]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validasi: judul dan penulis wajib diisi.
    if (!title.trim() || !author.trim()) {
      setError('Judul dan nama penulis wajib diisi.');
      return;
    }

    onSubmit({ title: title.trim(), author: author.trim(), status });

    // Kosongkan form setelah data dikirim.
    setTitle('');
    setAuthor('');
    setStatus('milik');
    setError('');
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingBook ? 'Edit Buku' : 'Tambah Buku'}</h2>
      <p className="book-form-info">
        {editingBook
          ? `Sedang mengedit "${editingBook.title}".`
          : 'Catat buku yang Anda miliki, sedang dibaca, atau ingin dibeli.'}
      </p>

      <div className="form-group">
        <label htmlFor="book-title">Judul Buku</label>
        <input
          id="book-title"
          type="text"
          value={title}
          placeholder="Contoh: Bumi Manusia"
          className={error && !title.trim() ? 'input-error' : ''}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="book-author">Nama Penulis</label>
        <input
          id="book-author"
          type="text"
          value={author}
          placeholder="Contoh: Pramoedya Ananta Toer"
          className={error && !author.trim() ? 'input-error' : ''}
          onChange={(event) => setAuthor(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="book-status">Status Buku</label>
        <select
          id="book-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}

      <div className="book-form-actions">
        <button type="submit" className="btn btn-primary btn-block">
          {editingBook ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>

        {editingBook && (
          <button type="button" className="btn btn-secondary btn-block" onClick={onCancelEdit}>
            Batal Edit
          </button>
        )}
      </div>
    </form>
  );
}

BookForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  editingBook: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
  onCancelEdit: PropTypes.func.isRequired,
};

export default BookForm;
