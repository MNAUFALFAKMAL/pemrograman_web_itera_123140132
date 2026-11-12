# ==============================================================================
# Berkas: library_item.py
# Deskripsi: Abstract class LibraryItem dan subclass Book & Magazine
# ==============================================================================

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """
    Abstract Base Class (ABC) sebagai dasar untuk semua item di perpustakaan.
    Menyatakan kontrak bahwa subclass wajib mengimplementasikan method abstract.
    """

    def __init__(self, item_id: str, judul: str, tahun_terbit: int):
        self._item_id = item_id  # Protected attribute
        self._judul = judul      # Protected attribute
        self.tahun_terbit = tahun_terbit
        self._is_dipinjam = False  # Protected attribute: status ketersediaan

    # --------------------------------------------------------------------------
    # PROPERTY: Status ketersediaan (hanya getter, setter di subclass jika perlu)
    # --------------------------------------------------------------------------
    @property
    def is_dipinjam(self) -> bool:
        """Membaca status apakah item sedang dipinjam"""
        return self._is_dipinjam

    @is_dipinjam.setter
    def is_dipinjam(self, status: bool):
        """Menetapkan status peminjaman (dipakai subclass jika perlu validasi)"""
        self._is_dipinjam = status

    # --------------------------------------------------------------------------
    # ABSTRACT METHODS: Wajib dioverride oleh subclass
    # --------------------------------------------------------------------------
    @abstractmethod
    def get_detail(self) -> str:
        """Mengembalikan detail lengkap item (diimplementasikan subclass)"""
        pass

    @abstractmethod
    def hitung_denda(self, hari_terlambat: int) -> float:
        """Menghitung denda peminjaman terlambat (diimplementasikan subclass)"""
        pass


class Book(LibraryItem):
    """
    Subclass Book mewarisi dari LibraryItem.
    Merepresentasikan buku fisik di perpustakaan.
    """

    def __init__(self, item_id: str, judul: str, tahun_terbit: int, penulis: str, jumlah_halaman: int):
        super().__init__(item_id, judul, tahun_terbit)
        self._penulis = penulis    # Protected attribute
        self._jumlah_halaman = jumlah_halaman  # Protected attribute

    # --------------------------------------------------------------------------
    # PROPERTY: Penulis (readonly via getter)
    # --------------------------------------------------------------------------
    @property
    def penulis(self) -> str:
        """Mengembalikan nama penulis buku"""
        return self._penulis

    # --------------------------------------------------------------------------
    # IMPLEMENTASI Abstract Method: get_detail
    # --------------------------------------------------------------------------
    def get_detail(self) -> str:
        return (f"Buku | ID: {self._item_id} | Judul: {self._judul} | "
                f"Tahun: {self.tahun_terbit} | Penulis: {self._penulis} | "
                f"Halaman: {self._jumlah_halaman}")

    # --------------------------------------------------------------------------
    # IMPLEMENTASI Abstract Method: hitung_denda
    # --------------------------------------------------------------------------
    def hitung_denda(self, hari_terlambat: int) -> float:
        """Denda buku: Rp 2000 per hari terlambat"""
        if hari_terlambat <= 0:
            return 0.0
        return round(hari_terlambat * 2000, 2)


class Magazine(LibraryItem):
    """
    Subclass Magazine mewarisi dari LibraryItem.
    Merepresentasikan majalah di perpustakaan.
    """

    def __init__(self, item_id: str, judul: str, tahun_terbit: int, nomor_issue: int):
        super().__init__(item_id, judul, tahun_terbit)
        self._nomor_issue = nomor_issue  # Protected attribute

    # --------------------------------------------------------------------------
    # PROPERTY: Nomor Issue (readonly via getter)
    # --------------------------------------------------------------------------
    @property
    def nomor_issue(self) -> int:
        """Mengembalikan nomor issue majalah"""
        return self._nomor_issue

    # --------------------------------------------------------------------------
    # IMPLEMENTASI Abstract Method: get_detail
    # --------------------------------------------------------------------------
    def get_detail(self) -> str:
        return (f"Majalah | ID: {self._item_id} | Judul: {self._judul} | "
                f"Tahun: {self.tahun_terbit} | Issue: {self._nomor_issue}")

    # --------------------------------------------------------------------------
    # IMPLEMENTASI Abstract Method: hitung_denda
    # --------------------------------------------------------------------------
    def hitung_denda(self, hari_terlambat: int) -> float:
        """Denda majalah: Rp 500 per hari terlambat (lebih murah daripada buku)"""
        if hari_terlambat <= 0:
            return 0.0
        return round(hari_terlambat * 500, 2)