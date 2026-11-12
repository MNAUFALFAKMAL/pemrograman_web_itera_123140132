# ===================================================
# Berkas: tugas2_nilai_mahasiswa.py
# Deskripsi: Pengelolaan data nilai mahasiswa
# ===================================================

# 1. Data mahasiswa (list of dictionary)
data_mahasiswa = [
    {"nama": "Ahmad Fadhilah", "nim": "123140101", "nilai_uts": 80, "nilai_uas": 85, "nilai_tugas": 90},
    {"nama": "Budi Santoso", "nim": "123140102", "nilai_uts": 70, "nilai_uas": 75, "nilai_tugas": 80},
    {"nama": "Siti Aminah", "nim": "123140103", "nilai_uts": 90, "nilai_uas": 95, "nilai_tugas": 88},
    {"nama": "Dewi Lestari", "nim": "123140104", "nilai_uts": 60, "nilai_uas": 65, "nilai_tugas": 70},
    {"nama": "Andi Pratama", "nim": "123140105", "nilai_uts": 50, "nilai_uas": 55, "nilai_tugas": 60},
]

# 2. Hitung nilai akhir dan grade setiap mahasiswa
for mhs in data_mahasiswa:
    nilai_akhir = (0.3 * mhs["nilai_uts"]) + (0.4 * mhs["nilai_uas"]) + (0.3 * mhs["nilai_tugas"])
    mhs["nilai_akhir"] = nilai_akhir

    if nilai_akhir >= 80:
        mhs["grade"] = "A"
    elif nilai_akhir >= 70:
        mhs["grade"] = "B"
    elif nilai_akhir >= 60:
        mhs["grade"] = "C"
    elif nilai_akhir >= 50:
        mhs["grade"] = "D"
    else:
        mhs["grade"] = "E"

# 3. Tampilkan tabel
print("--- DATA NILAI MAHASISWA ---")
print(f"{'Nama':<16}{'NIM':<12}{'Nilai Akhir':<14}{'Grade':<6}")
print("-" * 48)
for mhs in data_mahasiswa:
    print(f"{mhs['nama']:<16}{mhs['nim']:<12}{mhs['nilai_akhir']:<14.2f}{mhs['grade']:<6}")

# 4. Cari nilai tertinggi dan terendah
tertinggi = max(data_mahasiswa, key=lambda m: m["nilai_akhir"])
terendah = min(data_mahasiswa, key=lambda m: m["nilai_akhir"])

print("\nMahasiswa nilai tertinggi:")
print(f"  {tertinggi['nama']} ({tertinggi['nim']}) - {tertinggi['nilai_akhir']:.2f} (Grade {tertinggi['grade']})")

print("Mahasiswa nilai terendah:")
print(f"  {terendah['nama']} ({terendah['nim']}) - {terendah['nilai_akhir']:.2f} (Grade {terendah['grade']})")