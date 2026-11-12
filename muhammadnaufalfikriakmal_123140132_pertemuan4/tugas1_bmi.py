# ===================================================
# Berkas: tugas1_bmi.py
# Deskripsi: Program penghitung BMI (Body Mass Index) sederhana
# ===================================================

# 1. Input data dari pengguna
berat = float(input("Masukkan berat badan (kg): "))
tinggi = float(input("Masukkan tinggi badan (m): "))

# 2. Hitung nilai BMI
bmi = berat / (tinggi * tinggi)

# 3. Tentukan kategori BMI dengan if-elif-else
if bmi < 18.5:
    kategori = "Berat badan kurang"
elif bmi < 25:
    kategori = "Berat badan normal"
elif bmi < 30:
    kategori = "Berat badan berlebih"
else:
    kategori = "Obesitas"

# 4. Cetak hasil
print(f"\nNilai BMI Anda : {bmi:.2f}")
print(f"Kategori       : {kategori}")