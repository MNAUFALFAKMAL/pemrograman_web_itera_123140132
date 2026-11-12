import { renderHook } from '@testing-library/react';
import useBookStats from './useBookStats';

describe('Custom hook useBookStats', () => {
  test('menghitung jumlah buku per status dan jumlah penulis', () => {
    const books = [
      { id: 1, title: 'Buku A', author: 'Penulis A', status: 'milik' },
      { id: 2, title: 'Buku B', author: 'Penulis B', status: 'milik' },
      { id: 3, title: 'Buku C', author: 'Penulis A', status: 'baca' },
      { id: 4, title: 'Buku D', author: 'Penulis C', status: 'beli' },
    ];

    const { result } = renderHook(() => useBookStats(books));

    expect(result.current.total).toBe(4);
    expect(result.current.milik).toBe(2);
    expect(result.current.baca).toBe(1);
    expect(result.current.beli).toBe(1);
    expect(result.current.penulis).toBe(3);
    expect(result.current.persenMilik).toBe(50);
  });

  test('mengembalikan nol jika belum ada buku', () => {
    const { result } = renderHook(() => useBookStats([]));

    expect(result.current.total).toBe(0);
    expect(result.current.persenMilik).toBe(0);
  });
});
