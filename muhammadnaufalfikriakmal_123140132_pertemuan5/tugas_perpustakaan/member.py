# ==============================================================================
# Berkas: member.py
# Deskripsi: Class Member (anggota perpustakaan) dengan encapsulation & property
# ==============================================================================

class Member:
    """
    Merepresentasikan anggota perpustakaan yang dapat meminjam item.

    Menerapkan encapsulation:
    - __kontak bersifat private (name mangling) -> hanya bisa diakses via property.
    - _daftar_pinjaman bersifat protected.
    """

    def __init__(self, member_id: str, nama: str, kontak: str):
        self.member_id = member_id          # Public: ID keanggotaan
        self.nama = nama                    # Public: nama anggota
        self.__kontak = kontak              # Private: nomor HP/email anggota
        self._daftar_pinjaman = []          # Protected: daftar ID item yang dipinjam

    # --------------------------------------------------------------------------
    # PROPERTY: Kontak (getter & setter dengan validasi)
    # --------------------------------------------------------------------------
    @property
    def kontak(self) -> str:
        """Mengembalikan kontak anggota (read-accessible)"""
        return self.__kontak

    @kontak.setter
    def kontak(self, kontak_baru: str):
        """Set kontak dengan validasi minimal panjang karakter"""
        if not kontak_baru or len(kontak_baru.strip()) < 8:
            raise ValueError("Kontak anggota minimal 8 karakter!")
        self.__kontak = kontak_baru.strip()

    # --------------------------------------------------------------------------
    # PROPERTY: Daftar pinjaman (readonly copy agar tidak dimodifikasi luar)
    # --------------------------------------------------------------------------
    @property
    def daftar_pinjaman(self) -> list:
        """Mengembalikan salinan daftar pinjaman (mencegah modifikasi langsung)"""
        return list(self._daftar_pinjaman)

    # --------------------------------------------------------------------------
    # METHOD: Menambah item ke daftar pinjaman
    # --------------------------------------------------------------------------
    def tambah_pinjaman(self, item_id: str):
        if item_id not in self._daftar_pinjaman:
            self._daftar_pinjaman.append(item_id)

    # --------------------------------------------------------------------------
    # METHOD: Menghapus item dari daftar pinjaman (saat dikembalikan)
    # --------------------------------------------------------------------------
    def hapus_pinjaman(self, item_id: str):
        if item_id in self._daftar_pinjaman:
            self._daftar_pinjaman.remove(item_id)

    # --------------------------------------------------------------------------
    # METHOD: Detail anggota
    # --------------------------------------------------------------------------
    def get_detail(self) -> str:
        jumlah = len(self._daftar_pinjaman)
        return (f"Anggota | ID: {self.member_id} | Nama: {self.nama} | "
                f"Kontak: {self.__kontak} | Item dipinjam: {jumlah}")

    def __str__(self) -> str:
        return f"Member({self.nama}, pinjaman={len(self._daftar_pinjaman)})"