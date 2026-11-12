import { Link } from 'react-router-dom';
import './NotFound.css';

// Halaman fallback kalau URL tidak dikenal (route path="*").
function NotFound() {
  return (
    <div className="container notfound">
      <p className="notfound-code">404</p>
      <h1>Halaman Tidak Ditemukan</h1>
      <p>Alamat yang Anda buka tidak tersedia di aplikasi ini.</p>
      <Link to="/" className="btn btn-primary">
        Kembali ke Koleksi
      </Link>
    </div>
  );
}

export default NotFound;
