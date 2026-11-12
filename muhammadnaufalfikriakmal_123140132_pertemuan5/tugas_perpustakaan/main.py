# ==============================================================================
# Berkas: main.py
# Deskripsi: Skrip eksekusi untuk menguji seluruh fungsionalitas sistem perpustakaan
# ==============================================================================

from library_item import Book, Magazine
from library import Library
from member import Member


def main():
    print("=" * 60)
    print("    SISTEM MANAJEMEN PERPUSTAKAAN SEDERHANA")
    print("=" * 60)

    # Inisialisasi perpustakaan
    perpustakaan = Library("Perpustakaan Informatika ITERA")

    # --- Menambahkan item ke perpustakaan ---
    print("\n[1] Menambahkan item ke perpustakaan...")

    # Membuat beberapa buku
    buku1 = Book("B001", "Pemrograman Python Dasar", 2023, "John Doe", 350)
    buku2 = Book("B002", "Dasar-Dasar Basis Data", 2022, "Jane Smith", 420)

    # Membuat majalah
    majalah1 = Magazine("M001", "Tech Monthly Edition", 2024, 15)
    majalah2 = Magazine("M002", "Science Weekly", 2024, 8)

    # Menambahkan ke perpustakaan
    perpustakaan.tambah_item(buku1)
    perpustakaan.tambah_item(buku2)
    perpustakaan.tambah_item(majalah1)
    perpustakaan.tambah_item(majalah2)

    # Coba menambah item duplikat (harusnya gagal)
    buku3 = Book("B001", "Pemrograman Python Dasar", 2023, "John Doe", 350)
    perpustakaan.tambah_item(buku3)

    # --- Menampilkan katalog ---
    print("\n[2] Menampilkan katalog item...")
    perpustakaan.tampilkan_katalog()

    # --- Mencari item berdasarkan judul ---
    print("\n[3] Mencari item berdasarkan judul 'Python'...")
    hasil_cari = perpustakaan.cari_berdasarkan_judul("Python")
    if hasil_cari:
        print(f"Ditemukan: {hasil_cari.get_detail()}")
        print(f"Status dipinjam: {hasil_cari.is_dipinjam}")
    else:
        print("Item tidak ditemukan.")

    # --- Mencari item berdasarkan ID ---
    print("\n[4] Mencari item berdasarkan ID 'M002'...")
    item_ditemukan = perpustakaan.cari_berdasarkan_id("M002")
    if item_ditemukan:
        print(f"Ditemukan: {item_ditemukan.get_detail()}")
    else:
        print("Item tidak ditemukan.")

    # --- Membuat anggota perpustakaan ---
    print("\n[5] Mendaftarkan anggota...")
    anggota1 = Member("A001", "Ahmad Fadhil", "081234567890")
    anggota2 = Member("A002", "Nabila Putri", "089876543210")
    print(anggota1.get_detail())
    print(anggota2.get_detail())

    # --- Proses peminjaman item ---
    print("\n[6] Proses peminjaman item...")
    perpustakaan.pinjam_item(anggota1, "B001")  # Ahmad meminjam buku Python
    perpustakaan.pinjam_item(anggota1, "B001")  # Coba pinjam lagi -> gagal
    perpustakaan.pinjam_item(anggota2, "M002")  # Nabila meminjam majalah

    print("\nStatus anggota setelah peminjaman:")
    print(" ->", anggota1.get_detail())
    print(" ->", anggota2.get_detail())

    perpustakaan.tampilkan_katalog()

    # --- Proses pengembalian item ---
    print("\n[7] Proses pengembalian item...")
    perpustakaan.kembalikan_item(anggota1, "B001")
    print(" ->", anggota1.get_detail())

    # --- Menghitung denda ---
    print("\n[8] Menghitung denda peminjaman terlambat...")
    denda_buku = perpustakaan.hitung_total_denda("B001", 5)
    print(f"Denda untuk B001 (5 hari terlambat): Rp {denda_buku:.2f}")
    denda_majalah = perpustakaan.hitung_total_denda("M002", 3)
    print(f"Denda untuk M002 (3 hari terlambat): Rp {denda_majalah:.2f}")

    # --- Demonstrasi perubahan kontak anggota (property setter) ---
    print("\n[9] Demonstrasi encapsulation property setter (kontak anggota)...")
    print(f"Kontak lama {anggota1.nama}: {anggota1.kontak}")
    anggota1.kontak = "081200001111"
    print(f"Kontak baru {anggota1.nama}: {anggota1.kontak}")

    # --- Demonstration polymorphism ---
    print("\n[10] Demonstrasi Polymorphism (method get_detail dan hitung_denda)...")
    print("Mengiterasi seluruh koleksi dan memanggil method yang sama...")
    for item in perpustakaan._Library__koleksi:
        print(f"  -> {item.get_detail()}")
        print(f"     Denda 5 hari: Rp {item.hitung_denda(5):.2f}")

    print("\n" + "=" * 60)
    print("    SELESAI MENGERJAKAN TUGAS PERTEMUAN 05")
    print("=" * 60)


if __name__ == "__main__":
    main()