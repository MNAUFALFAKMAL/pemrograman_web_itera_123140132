/**
 * Custom hook untuk menghitung statistik koleksi buku.
 * Hasilnya dipakai di halaman Home (ringkasan) dan halaman Stats.
 */
function useBookStats(books) {
  const total = books.length;
  const milik = books.filter((book) => book.status === 'milik').length;
  const baca = books.filter((book) => book.status === 'baca').length;
  const beli = books.filter((book) => book.status === 'beli').length;

  const penulis = new Set(books.map((book) => book.author.toLowerCase())).size;
  const persenMilik = total > 0 ? Math.round((milik / total) * 100) : 0;

  return { total, milik, baca, beli, penulis, persenMilik };
}

export default useBookStats;
