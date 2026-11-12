# ===================================================
# Berkas: main.py
# Deskripsi: Program utama pengguna modul math_operations
# ===================================================

# Cara 1: import modul secara keseluruhan
import math_operations as mo

# Cara 2: import fungsi spesifik langsung
from math_operations import celsius_ke_fahrenheit, celsius_ke_kelvin, PI

print("--- BANGUN DATAR ---")
sisi = 5
print(f"Persegi (sisi {sisi})")
print(f"  Luas     : {mo.luas_persegi(sisi)}")
print(f"  Keliling : {mo.keliling_persegi(sisi)}")

panjang, lebar = 8, 4
print(f"\nPersegi Panjang ({panjang} x {lebar})")
print(f"  Luas     : {mo.luas_persegi_panjang(panjang, lebar)}")
print(f"  Keliling : {mo.keliling_persegi_panjang(panjang, lebar)}")

r = 7
print(f"\nLingkaran (r = {r})")
print(f"  Luas     : {mo.luas_lingkaran(r):.2f}")
print(f"  Keliling : {mo.keliling_lingkaran(r):.2f}")
print(f"  Konstanta PI : {PI}")

print("\n--- KONVERSI SUHU ---")
c = 100
print(f"{c} C = {celsius_ke_fahrenheit(c):.2f} F")
print(f"{c} C = {celsius_ke_kelvin(c):.2f} K")