import { NavLink } from 'react-router-dom';
import './Navbar.css';

// Navigasi utama aplikasi memakai NavLink agar menu aktif ditandai.
function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <NavLink to="/" className="navbar-brand">
          Rak Buku
        </NavLink>

        <ul className="navbar-menu">
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Koleksi
            </NavLink>
          </li>
          <li>
            <NavLink to="/stats" className={({ isActive }) => (isActive ? 'active' : '')}>
              Statistik
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
