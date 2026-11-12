import useBookStats from '../../hooks/useBookStats';
import { useBooks } from '../../context/BookContext';
import { STATUS_OPTIONS } from '../../utils/status';
import './Stats.css';

// Halaman statistik: ringkasan koleksi buku dari Context.
function Stats() {
  const { books } = useBooks();
  const stats = useBookStats(books);

  return (
    <div className="container stats-page">
      <header className="stats-header">
        <h1>Statistik Koleksi</h1>
        <p>Ringkasan buku yang tersimpan di aplikasi ini.</p>
      </header>

      <div className="stats-grid">
        <div className="stats-card">
          <span>Total Buku</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stats-card">
          <span>Jumlah Penulis</span>
          <strong>{stats.penulis}</strong>
        </div>
        <div className="stats-card">
          <span>Koleksi Dimiliki</span>
          <strong>{stats.persenMilik}%</strong>
        </div>
      </div>

      <section className="stats-section">
        <h2>Sebaran Status Buku</h2>

        {stats.total === 0 ? (
          <p className="stats-empty">Belum ada data buku. Tambahkan buku dulu di halaman Koleksi.</p>
        ) : (
          <ul className="stats-list">
            {STATUS_OPTIONS.map((option) => {
              const jumlah =
                option.value === 'milik'
                  ? stats.milik
                  : option.value === 'baca'
                    ? stats.baca
                    : stats.beli;
              const persen = Math.round((jumlah / stats.total) * 100);

              return (
                <li key={option.value} className="stats-row">
                  <div className="stats-row-info">
                    <span>{option.label}</span>
                    <span className="stats-row-value">
                      {jumlah} buku ({persen}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill fill-${option.value}`}
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="stats-section">
        <h2>Cara Kerja Perhitungan</h2>
        <p className="stats-note">
          Semua angka di halaman ini dihitung oleh custom hook <code>useBookStats</code> dari
          daftar buku yang disimpan di Context, sehingga halaman Home dan Statistik selalu
          menampilkan data yang sama.
        </p>
      </section>
    </div>
  );
}

export default Stats;
