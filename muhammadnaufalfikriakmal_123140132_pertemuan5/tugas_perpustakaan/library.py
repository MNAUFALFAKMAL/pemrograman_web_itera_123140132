# ==============================================================================
# Berkas: library.py
# Deskripsi: Class Library untuk menyimpan dan mengelola koleksi item perpustakaan
# ==============================================================================

class Library:
    """
    Class Library mengelola koleksi item perpustakaan.
    Melakukan enkapsulasi terhadap atribut koleksi menggunakan private attribute.
    """

    def __init__(self, nama_perpustakaan: str):
        self.nama_perpustakaan = nama_perpustakaan
        self.__koleksi = []  # Private attribute: menyimpan daftar item LibraryItem

    # --------------------------------------------------------------------------
    # METHOD: Menambah item ke dalam koleksi
    # --------------------------------------------------------------------------
    def tambah_item(self, item: LibraryItem) -> bool:
        """
        Menambah item ke dalam koleksi perpustakaan.
        Returns True jika berhasil, False jika item sudah ada ( berdasarkan ID ).
        """
        for existing in self.__koleksi:
            if existing._item_id == item._item_id:
                print(f"[PERINGATAN] Item dengan ID {item._item_id} sudah ada di koleksi!")
                return False
        self.__koleksi.append(item)
        print(f"[SUKSES] Item '{item._judul}' berhasil ditambahkan ke {self.nama_perpustakaan}.")
        return True

    # --------------------------------------------------------------------------
    # METHOD: Menampilkan katalog item yang tersedia
    # --------------------------------------------------------------------------
    def tampilkan_katalog(self) -> None:
        """Menampilkan daftar semua item di perpustakaan dengan detail lengkap."""
        print(f"\n=== KATALOG {self.nama_perpustakaan} ===")
        print(f"Total item: {len(self.__koleksi)}")
        print("-" * 60)
        if not self.__koleksi:
            print("Belum ada item di katalog.")
        else:
            for idx, item in enumerate(self.__koleksi, 1):
                print(f"{idx}. {item.get_detail()} | Dipinjam: {item.is_dipinjam}")
        print("-" * 60)

    # --------------------------------------------------------------------------
    # METHOD: Mencari item berdasarkan judul
    # --------------------------------------------------------------------------
    def cari_berdasarkan_judul(self, judul: str) -> LibraryItem | None:
        """
        Mencari item berdasarkan judul (case-insensitive).
        Returns object item jika ditemukan, None jika tidak ditemukan.
        """
        judul_lower = judul.lower()
        for item in self.__koleksi:
            if judul_lower in item._judul.lower():
                return item
        return None

    # --------------------------------------------------------------------------
    # METHOD: Mencari item berdasarkan ID
    # --------------------------------------------------------------------------
    def cari_berdasarkan_id(self, item_id: str) -> LibraryItem | None:
        """
        Mencari item berdasarkan ID exact.
        Returns object item jika ditemukan, None jika tidak ditemukan.
        """
        for item in self.__koleksi:
            if item._item_id == item_id:
                return item
        return None

    # --------------------------------------------------------------------------
    # METHOD: Mengubah status peminjaman item
    # --------------------------------------------------------------------------
    def set_status_peminjaman(self, item_id: str, status: bool) -> bool:
        """
        Mengubah status apakah item sedang dipinjam.
        Returns True jika item berhasil diubah statusnya, False jika item tidak ditemukan.
        """
        item = self.cari_berdasarkan_id(item_id)
        if item:
            item.is_dipinjam = status
            status_teks = "dipinjam" if status else "dikembalikan"
            print(f"[INFO] Item {item._judul} berhasil di-status sebagai: {status_teks}")
            return True
        print("[GAGAL] Item tidak ditemukan di katalog.")
        return False

    # --------------------------------------------------------------------------
    # METHOD: Meminjamkan item kepada anggota
    # --------------------------------------------------------------------------
    def pinjam_item(self, member, item_id: str) -> bool:
        """
        Memproses peminjaman item oleh seorang anggota.
        Returns True jika berhasil, False jika item tidak ada atau sedang dipinjam.
        """
        item = self.cari_berdasarkan_id(item_id)
        if item is None:
            print(f"[GAGAL] Item dengan ID {item_id} tidak ditemukan.")
            return False
        if item.is_dipinjam:
            print(f"[GAGAL] Item '{item._judul}' sedang dipinjam orang lain.")
            return False

        item.is_dipinjam = True
        member.tambah_pinjaman(item_id)
        print(f"[PINJAM] '{item._judul}' berhasil dipinjam oleh {member.nama}.")
        return True

    # --------------------------------------------------------------------------
    # METHOD: Mengembalikan item dari anggota
    # --------------------------------------------------------------------------
    def kembalikan_item(self, member, item_id: str) -> bool:
        """
        Memproses pengembalian item oleh anggota.
        Returns True jika berhasil, False jika item tidak sedang dipinjam anggota tsb.
        """
        item = self.cari_berdasarkan_id(item_id)
        if item is None:
            print(f"[GAGAL] Item dengan ID {item_id} tidak ditemukan.")
            return False
        if item_id not in member.daftar_pinjaman:
            print(f"[GAGAL] {member.nama} tidak meminjam item ini.")
            return False

        item.is_dipinjam = False
        member.hapus_pinjaman(item_id)
        print(f"[KEMBALI] '{item._judul}' telah dikembalikan oleh {member.nama}.")
        return True

    # --------------------------------------------------------------------------
    # METHOD: Menghitung total denda untuk item terlambat
    # --------------------------------------------------------------------------
    def hitung_total_denda(self, item_id: str, hari_terlambat: int) -> float:
        """
        Menghitung denda untuk item tertentu berdasarkan hari terlambat.
        Returns total denda (float), atau 0 jika item tidak ditemukan.
        """
        item = self.cari_berdasarkan_id(item_id)
        if item:
            return item.hitung_denda(hari_terlambat)
        return 0.0