// Latihan 02 - Loop, Fungsi, dan Event Handler

// ========== 1. Tabel perkalian (angka pilihan: 7) dengan for loop ==========
function buatTabelPerkalian(angka) {
  let baris = "";
  for (let i = 1; i <= 10; i++) {
    baris += `<tr><td>${angka} x ${i}</td><td><strong>${angka * i}</strong></td></tr>`;
  }
  return `<table><tbody>${baris}</tbody></table>`;
}

// ========== 2. Faktorial dengan loop ==========
function hitungFaktorial(n) {
  if (n < 0 || !Number.isInteger(n)) return "Input tidak valid";
  let hasil = 1;
  for (let i = 2; i <= n; i++) {
    hasil *= i;
  }
  return hasil;
}

// ========== 3. Cek bilangan prima ==========
function adalahPrima(n) {
  if (n < 2 || !Number.isInteger(n)) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// ========== 4. FizzBuzz 1 sampai 100 ==========
function fizzBuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}

const hasilFizzBuzz = [];
for (let i = 1; i <= 100; i++) {
  hasilFizzBuzz.push(fizzBuzz(i));
}

// ========== Render ke halaman ==========
const daftarPrima = [];
for (let i = 1; i <= 50; i++) {
  if (adalahPrima(i)) daftarPrima.push(i);
}

document.getElementById("result").innerHTML = `
  <div class="kartu">
    <h2>1. Tabel Perkalian Angka 7 (for loop)</h2>
    ${buatTabelPerkalian(7)}
  </div>

  <div class="kartu">
    <h2>2. Faktorial</h2>
    <p>7! = <strong>${hitungFaktorial(7)}</strong> , 0! = <strong>${hitungFaktorial(0)}</strong></p>
  </div>

  <div class="kartu">
    <h2>3. Bilangan Prima (1-50)</h2>
    <p>${daftarPrima.join(", ")}</p>
    <p>Cek 29: <strong>${adalahPrima(29) ? "Prima" : "Bukan prima"}</strong> ,
       Cek 30: <strong>${adalahPrima(30) ? "Prima" : "Bukan prima"}</strong></p>
  </div>

  <div class="kartu">
    <h2>4. FizzBuzz (1-100)</h2>
    <pre>${hasilFizzBuzz.join(" | ")}</pre>
  </div>
`;

// ========== 5. Kalkulator BMI (event handler) ==========
document.getElementById("btn-bmi").addEventListener("click", function () {
  const berat = parseFloat(document.getElementById("berat").value);
  const tinggi = parseFloat(document.getElementById("tinggi").value);
  const keluaran = document.getElementById("hasil-bmi");

  if (isNaN(berat) || isNaN(tinggi) || berat <= 0 || tinggi <= 0) {
    keluaran.textContent = "Masukkan berat dan tinggi yang valid!";
    keluaran.style.color = "#dc2626";
    return;
  }

  const tinggiMeter = tinggi / 100;
  const bmi = berat / (tinggiMeter * tinggiMeter);
  let kategori = "";

  if (bmi < 18.5) kategori = "Kurus";
  else if (bmi < 25) kategori = "Normal";
  else if (bmi < 30) kategori = "Berlebih";
  else kategori = "Obesitas";

  keluaran.textContent = `BMI: ${bmi.toFixed(1)} - Kategori: ${kategori}`;
  keluaran.style.color = "#1f2937";
});
