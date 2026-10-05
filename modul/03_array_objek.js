// Latihan 03 - Array dan Objek (CRUD sederhana)

// ========== Data awal: array objek mahasiswa ==========
const daftarMahasiswa = [
  { nama: "Aisyah Putri",    nim: "123140001", jurusan: "Teknik Informatika", nilai: 87 },
  { nama: "Bagus Saputra",   nim: "123140002", jurusan: "Sistem Informasi",    nilai: 74 },
  { nama: "Citra Dewi",      nim: "123140003", jurusan: "Teknik Informatika",  nilai: 92 },
  { nama: "Dimas Prayoga",   nim: "123140004", jurusan: "Data Science",        nilai: 68 },
  { nama: "Eka Wulandari",   nim: "123140005", jurusan: "Sistem Informasi",    nilai: 81 },
];

let urutNaik = true;

// ========== Utilitas perhitungan ==========
function cariNilaiTertinggi(mahasiswa) {
  return mahasiswa.reduce((tertinggi, m) => (m.nilai > tertinggi.nilai ? m : tertinggi));
}

function hitungRataRata(mahasiswa) {
  const total = mahasiswa.reduce((sum, m) => sum + m.nilai, 0);
  return mahasiswa.length ? total / mahasiswa.length : 0;
}

function filterDiAtasRataRata(mahasiswa) {
  const rataRata = hitungRataRata(mahasiswa);
  return mahasiswa.filter((m) => m.nilai > rataRata);
}

function urutBerdasarkanNama(mahasiswa, naik = true) {
  return [...mahasiswa].sort((a, b) =>
    naik ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama)
  );
}

// ========== Render ==========
function render() {
  const tertinggi = cariNilaiTertinggi(daftarMahasiswa);
  const rataRata = hitungRataRata(daftarMahasiswa);
  const diAtasRata = filterDiAtasRataRata(daftarMahasiswa);
  const terurut = urutBerdasarkanNama(daftarMahasiswa, urutNaik);

  document.getElementById("result").innerHTML = `
    <div class="kartu">
      <h2>1. Tabel Mahasiswa</h2>
      <table>
        <thead><tr><th>No</th><th>Nama</th><th>NIM</th><th>Jurusan</th><th>Nilai</th><th>Aksi</th></tr></thead>
        <tbody>
          ${daftarMahasiswa.map((m, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${m.nama}</td>
              <td>${m.nim}</td>
              <td>${m.jurusan}</td>
              <td>${m.nilai}</td>
              <td><button class="btn-hapus" data-nim="${m.nim}">Hapus</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
      ${daftarMahasiswa.length === 0 ? "<p>Data mahasiswa masih kosong.</p>" : ""}
    </div>

    <div class="kartu">
      <h2>2. Nilai Tertinggi (reduce)</h2>
      ${daftarMahasiswa.length
        ? `<p><strong>${tertinggi.nama}</strong> - nilai ${tertinggi.nilai}</p>`
        : "<p>Belum ada data.</p>"}
      <h2>3. Di Atas Rata-rata (filter)</h2>
      <p>Rata-rata nilai: <strong>${rataRata.toFixed(2)}</strong></p>
      <p>${diAtasRata.length
        ? diAtasRata.map((m) => `${m.nama} (${m.nilai})`).join(", ")
        : "Tidak ada mahasiswa di atas rata-rata."}</p>
    </div>

    <div class="kartu">
      <h2>4. Urutkan Berdasarkan Nama</h2>
      <button id="btn-urut">Urutkan: ${urutNaik ? "A -> Z" : "Z -> A"}</button>
      <ol>${terurut.map((m) => `<li>${m.nama}</li>`).join("")}</ol>
    </div>
  `;

  // Event: hapus item
  document.querySelectorAll(".btn-hapus").forEach((tombol) => {
    tombol.addEventListener("click", function () {
      const index = daftarMahasiswa.findIndex((m) => m.nim === this.dataset.nim);
      if (index !== -1) daftarMahasiswa.splice(index, 1);
      render();
    });
  });

  // Event: ubah arah urutan
  document.getElementById("btn-urut").addEventListener("click", function () {
    urutNaik = !urutNaik;
    render();
  });
}

// ========== CRUD: tambah data ==========
document.getElementById("btn-tambah").addEventListener("click", function () {
  const pesan = document.getElementById("pesan-crud");
  const nama = document.getElementById("input-nama").value.trim();
  const nim = document.getElementById("input-nim").value.trim();
  const jurusan = document.getElementById("input-jurusan").value.trim();
  const nilai = Number(document.getElementById("input-nilai").value);

  if (nama.length < 3) {
    pesan.textContent = "Nama minimal 3 karakter.";
    return;
  }
  if (nim === "") {
    pesan.textContent = "NIM wajib diisi.";
    return;
  }
  if (daftarMahasiswa.some((m) => m.nim === nim)) {
    pesan.textContent = "NIM sudah terdaftar.";
    return;
  }
  if (jurusan === "") {
    pesan.textContent = "Jurusan wajib diisi.";
    return;
  }
  if (!Number.isFinite(nilai) || nilai < 0 || nilai > 100) {
    pesan.textContent = "Nilai harus berupa angka 0-100.";
    return;
  }

  daftarMahasiswa.push({ nama, nim, jurusan, nilai });
  pesan.textContent = "";

  ["input-nama", "input-nim", "input-jurusan", "input-nilai"].forEach((id) => {
    document.getElementById(id).value = "";
  });

  render();
});

render();
