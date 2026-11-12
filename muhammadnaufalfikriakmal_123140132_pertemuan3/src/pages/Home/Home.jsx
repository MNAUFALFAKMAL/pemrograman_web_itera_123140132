import { useState } from 'react';
import BookForm from '../../components/BookForm/BookForm';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookList from '../../components/BookList/BookList';
import useBookStats from '../../hooks/useBookStats';
import { useBooks } from '../../context/BookContext';
import './Home.css';

// Halaman utama: form, filter, pencarian, dan daftar buku.
function Home() {
  // Ambil data & fungsi dari Context, jadi tidak perlu props berjenjang.
  const { books, addBook, updateBook, deleteBook } = useBooks();

  const [filter, setFilter] = useState('semua');
  const [search, setSearch] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  const stats = useBookStats(books);

  // Filter berdasarkan status, lalu saring lagi berdasarkan kata kunci.
  const filteredBooks = books.filter((book) => {
    const cocokStatus = filter === 'semua' || book.status === filter;
    const kataKunci = search.toLowerCase();
    const cocokCari =
      book.title.toLowerCase().includes(kataKunci) ||
      book.author.toLowerCase().includes(kataKunci);

    return cocokStatus && cocokCari;
  });

  const handleSubmit = (data) => {
    if (editingBook) {
      updateBook(editingBook.id, data);
      setEditingBook(null);
    } else {
      addBook(data);
    }
  };

  const handleDelete = (id) => {
    const yakin = window.confirm('Yakin ingin menghapus buku ini?');

    if (yakin) {
      deleteBook(id);

      // Kalau buku yang sedang diedit dihapus, tutup mode edit.
      if (editingBook && editingBook.id === id) {
        setEditingBook(null);
      }
    }
  };

  return (
    <div>
      <header className="home-header">
        <div className="container">
          <p className="home-eyebrow">Praktikum PAW - Pertemuan 3</p>
          <h1>Manajemen Buku Pribadi</h1>
          <p className="home-subtitle">
            Catat buku yang Anda miliki, sedang dibaca, atau ingin dibeli.
            Data tersimpan otomatis di browser.
          </p>

          <div className="home-stats">
            <div className="stat-card">
              <span>Total Buku</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <span>Milik</span>
              <strong>{stats.milik}</strong>
            </div>
            <div className="stat-card">
              <span>Sedang Dibaca</span>
              <strong>{stats.baca}</strong>
            </div>
            <div className="stat-card">
              <span>Ingin Dibeli</span>
              <strong>{stats.beli}</strong>
            </div>
          </div>
        </div>
      </header>

      <div className="container home-content">
        <aside className="home-sidebar">
          <BookForm
            onSubmit={handleSubmit}
            editingBook={editingBook}
            onCancelEdit={() => setEditingBook(null)}
          />
        </aside>

        <section className="home-main">
          <BookFilter
            filter={filter}
            search={search}
            onFilterChange={setFilter}
            onSearchChange={setSearch}
          />

          <p className="result-info">
            Menampilkan {filteredBooks.length} dari {books.length} buku
          </p>

          <BookList books={filteredBooks} onEdit={setEditingBook} onDelete={handleDelete} />
        </section>
      </div>
    </div>
  );
}

export default Home;
