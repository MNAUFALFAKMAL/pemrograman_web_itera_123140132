import { act, renderHook } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('Custom hook useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('menyimpan nilai terbaru ke localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_buku', []));

    act(() => {
      result.current[1]([{ id: 1, title: 'Bumi Manusia' }]);
    });

    expect(JSON.parse(localStorage.getItem('test_buku'))).toEqual([
      { id: 1, title: 'Bumi Manusia' },
    ]);
  });

  test('membaca nilai awal dari localStorage', () => {
    localStorage.setItem('test_buku', JSON.stringify([{ id: 9, title: 'Laskar Pelangi' }]));

    const { result } = renderHook(() => useLocalStorage('test_buku', []));

    expect(result.current[0]).toEqual([{ id: 9, title: 'Laskar Pelangi' }]);
  });
});
