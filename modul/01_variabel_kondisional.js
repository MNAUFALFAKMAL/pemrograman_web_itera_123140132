// Latihan 01 - Variabel, Tipe Data, dan Struktur Kondisional

// ========== 1. Data diri dengan const dan let ==========
const nama = "Muhammad Naufal Fikri Akmal";
const kotaAsal = "Padang";
let umur = 20;

console.log("Nama:", nama, "| Umur:", umur, "| Kota:", kotaAsal);

// ========== 2. Pengecekan kelulusan (syarat nilai >= 70) ==========
const nilaiAkhir = 78;
let statusLulus;

if (nilaiAkhir >= 70) {
  statusLulus = "Lulus";
} else {
  statusLulus = "Tidak Lulus";
}

// ========== 3. Kategori umur ==========
function kategoriUmur(usia) {
  if (usia < 12) return "Anak-anak";
  if (usia <= 17) return "Remaja";
  if (usia <= 59) return "Dewasa";
  return "Lansia";
}

const daftarUmur = [8, 15, 24, 65];

// ========== 4. Switch-case: konversi angka hari (1-7) ke nama hari ==========
function namaHariInggris(nomorHari) {
  switch (nomorHari) {
    case 1: return "Monday";
    case 2: return "Tuesday";
    case 3: return "Wednesday";
    case 4: return "Thursday";
    case 5: return "Friday";
    case 6: return "Saturday";
    case 7: return "Sunday";
    default: return "Invalid day";
  }
}

const hariIni = new Date().getDay() === 0 ? 7 : new Date().getDay();

// ========== 5. Kalkulator grade dengan ternary ==========
function hitungGrade(nilai) {
  return nilai >= 90 ? "A"
    : nilai >= 80 ? "B"
    : nilai >= 70 ? "C"
    : nilai >= 60 ? "D"
    : "E";
}

const contohNilai = [95, 84, 71, 62, 45];

// ========== Render ke halaman ==========
document.getElementById("result").innerHTML = `
  <div class="kartu">
    <h2>1. Data Diri (const &amp; let)</h2>
    <p>Nama: <strong>${nama}</strong></p>
    <p>Umur: <strong>${umur}</strong> tahun</p>
    <p>Kota Asal: <strong>${kotaAsal}</strong></p>
  </div>

  <div class="kartu">
    <h2>2. Pengecekan Kelulusan (nilai minimal 70)</h2>
    <p>Nilai: <strong>${nilaiAkhir}</strong> -> Status: <strong>${statusLulus}</strong></p>
  </div>

  <div class="kartu">
    <h2>3. Kategori Umur</h2>
    <ul>
      ${daftarUmur.map((u) => `<li>${u} tahun -> <strong>${kategoriUmur(u)}</strong></li>`).join("")}
    </ul>
  </div>

  <div class="kartu">
    <h2>4. Switch-case Nama Hari (Inggris)</h2>
    <p>Nomor hari ${hariIni} -> <strong>${namaHariInggris(hariIni)}</strong></p>
  </div>

  <div class="kartu">
    <h2>5. Kalkulator Grade (ternary)</h2>
    <ul>
      ${contohNilai.map((n) => `<li>Nilai ${n} -> Grade <strong>${hitungGrade(n)}</strong></li>`).join("")}
    </ul>
  </div>
`;
