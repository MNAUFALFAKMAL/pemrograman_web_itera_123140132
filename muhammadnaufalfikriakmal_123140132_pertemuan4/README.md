# Praktikum Pemrograman Web - Pertemuan 4 (Python Dasar)

**Nama:** Muhammad Naufal Fikri Akmal  
**NIM:** 123140132  
**Kelas:** (isi kelas)  
**Mata Kuliah:** Praktikum Pengembangan Aplikasi Web - ITERA

---

## 1. Deskripsi Program

### tugas1_bmi.py
Program penghitung BMI (Body Mass Index). Menerima input berat (kg) dan tinggi (m),
menghitung BMI, lalu menampilkan kategori: berat kurang, normal, berlebih, atau obesitas.

### tugas2_nilai_mahasiswa.py
Pengelolaan data nilai 5 mahasiswa. Menghitung nilai akhir dengan bobot
30% UTS + 40% UAS + 30% Tugas, menentukan grade A-E, menampilkan tabel rapi,
serta mencari nilai tertinggi dan terendah.

### math_operations.py
Modul matematika berisi fungsi luas dan keliling untuk persegi, persegi panjang,
dan lingkaran, serta konversi suhu Celsius ke Fahrenheit dan Kelvin. Memiliki
konstanta PI.

### main.py
Program utama yang mengimpor modul math_operations dengan dua cara berbeda
(`import ... as` dan `from ... import ...`) dan menampilkan hasil kalkulasi.

---

## 2. Cara Menjalankan

Buka folder ini di terminal/VS Code, lalu jalankan:

```bash
python tugas1_bmi.py
python tugas2_nilai_mahasiswa.py
python main.py
```

Untuk tugas1, masukkan berat (kg) dan tinggi (m) saat diminta.

---

## 3. Struktur Folder

```text
muhammadnaufalfikriakmal_123140132_pertemuan4/
├── .gitignore
├── README.md
├── tugas1_bmi.py
├── tugas2_nilai_mahasiswa.py
├── math_operations.py
└── main.py
```

---

## 4. Screenshot Hasil Eksekusi

Lihat output program pada terminal (contoh di bawah).

Hasil `tugas2_nilai_mahasiswa.py`:

```
--- DATA NILAI MAHASISWA ---
Nama                NIM         Nilai Akhir   Grade
----------------------------------------------------
Naufal Fikri        123140132   85.00         A
Aji Nur             123140189   75.00         B
Danang              123140005   91.40         A
Rian                123140190   65.00         C
Nabila Mujahidin    123140062   55.00         D

Mahasiswa nilai tertinggi:
  Danang (123140005) - 91.40 (Grade A)
Mahasiswa nilai terendah:
  Nabila Mujahidin (123140062) - 55.00 (Grade D)
```

Hasil `main.py`:

```
--- BANGUN DATAR ---
Persegi (sisi 5)
  Luas     : 25
  Keliling : 20

Persegi Panjang (8 x 4)
  Luas     : 32
  Keliling : 24

Lingkaran (r = 7)
  Luas     : 153.94
  Keliling : 43.98
  Konstanta PI : 3.14159

--- KONVERSI SUHU ---
100 C = 212.00 F
100 C = 373.15 K
```