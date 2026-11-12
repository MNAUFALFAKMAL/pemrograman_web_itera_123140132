# ===================================================
# Berkas: math_operations.py
# Deskripsi: Modul operasi matematika dasar
# ===================================================

PI = 3.14159


def luas_persegi(sisi):
    """Menghitung luas persegi dari panjang sisi."""
    return sisi * sisi


def keliling_persegi(sisi):
    """Menghitung keliling persegi dari panjang sisi."""
    return 4 * sisi


def luas_persegi_panjang(panjang, lebar):
    """Menghitung luas persegi panjang."""
    return panjang * lebar


def keliling_persegi_panjang(panjang, lebar):
    """Menghitung keliling persegi panjang."""
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari):
    """Menghitung luas lingkaran."""
    return PI * jari_jari * jari_jari


def keliling_lingkaran(jari_jari):
    """Menghitung keliling (circumference) lingkaran."""
    return 2 * PI * jari_jari


def celsius_ke_fahrenheit(celsius):
    """Konversi suhu dari Celsius ke Fahrenheit."""
    return (celsius * 9 / 5) + 32


def celsius_ke_kelvin(celsius):
    """Konversi suhu dari Celsius ke Kelvin."""
    return celsius + 273.15


if __name__ == "__main__":
    print("Test modul math_operations:")
    print("Luas persegi (sisi 4):", luas_persegi(4))
    print("Celsius 100 -> Fahrenheit:", celsius_ke_fahrenheit(100))