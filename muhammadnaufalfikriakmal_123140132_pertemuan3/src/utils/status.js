/**
 * Daftar status buku yang dipakai di form, filter, dan kartu buku.
 * value  = disimpan di state & localStorage
 * label  = teks yang tampil di layar
 */
export const STATUS_OPTIONS = [
  { value: 'milik', label: 'Milik' },
  { value: 'baca', label: 'Sedang Dibaca' },
  { value: 'beli', label: 'Ingin Dibeli' },
];

export const STATUS_LABEL = {
  milik: 'Milik',
  baca: 'Sedang Dibaca',
  beli: 'Ingin Dibeli',
};

export const FILTER_OPTIONS = [{ value: 'semua', label: 'Semua' }, ...STATUS_OPTIONS];
