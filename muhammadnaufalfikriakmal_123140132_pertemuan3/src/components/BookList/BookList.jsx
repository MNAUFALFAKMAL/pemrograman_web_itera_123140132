import PropTypes from 'prop-types';
import { STATUS_LABEL } from '../../utils/status';
import './BookList.css';

/**
 * Menampilkan daftar buku.
 * Setiap item wajib punya key unik (book.id) supaya React bisa
 * memperbarui daftar dengan efisien.
 */
function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <p className="book-list-empty">
        Belum ada buku yang ditampilkan. Tambahkan buku baru lewat formulir.
      </p>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <article key={book.id} className={`book-item status-${book.status}`}>
          <span className="book-status">{STATUS_LABEL[book.status]}</span>
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">oleh {book.author}</p>

          <div className="book-actions">
            <button type="button" className="btn btn-secondary" onClick={() => onEdit(book)}>
              Edit
            </button>
            <button type="button" className="btn btn-danger" onClick={() => onDelete(book.id)}>
              Hapus
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookList;
