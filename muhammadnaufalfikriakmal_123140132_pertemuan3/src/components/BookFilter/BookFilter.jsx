import PropTypes from 'prop-types';
import { FILTER_OPTIONS } from '../../utils/status';
import './BookFilter.css';

// Komponen pencarian judul/penulis + tombol filter status.
function BookFilter({ filter, search, onFilterChange, onSearchChange }) {
  return (
    <div className="book-filter">
      <div className="search-box">
        <label htmlFor="search-book">Cari buku</label>
        <input
          id="search-book"
          type="search"
          value={search}
          placeholder="Cari judul atau nama penulis..."
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="filter-buttons">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={filter === option.value ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

BookFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default BookFilter;
