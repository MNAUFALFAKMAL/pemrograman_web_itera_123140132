import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

// Context global: semua data buku disimpan di satu tempat.
const BookContext = createContext();

// Hook untuk mengambil data buku dari Context.
export function useBooks() {
  const context = useContext(BookContext);

  if (!context) {
    throw new Error('useBooks harus digunakan di dalam BookProvider');
  }

  return context;
}

export function BookProvider({ children }) {
  // Data buku otomatis tersimpan di localStorage dengan key "buku_data".
  const [books, setBooks] = useLocalStorage('buku_data', []);

  const addBook = (book) => {
    const newBook = {
      id: Date.now(),
      title: book.title,
      author: book.author,
      status: book.status,
    };
    setBooks([...books, newBook]);
  };

  const updateBook = (id, data) => {
    setBooks(
      books.map((book) => (book.id === id ? { ...book, ...data } : book)),
    );
  };

  const deleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const value = { books, addBook, updateBook, deleteBook };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
