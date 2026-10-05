// Latihan 04 - Manipulasi DOM, localStorage, dan Fetch API

const STORAGE_KEY = "latihan_catatan";

// ========== Dark mode toggle ==========
const tombolDark = document.getElementById("btn-dark");
tombolDark.addEventListener("click", function () {
  const aktif = document.body.classList.toggle("gelap");
  tombolDark.textContent = aktif ? "Nonaktifkan Dark Mode" : "Aktifkan Dark Mode";
});

// ========== 1 & 2. Catatan + validasi + localStorage ==========
function muatCatatan() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const hasil = data ? JSON.parse(data) : [];
    return Array.isArray(hasil) ? hasil : [];
  } catch (err) {
    return [];
  }
}

let catatan = muatCatatan();

function simpanCatatan() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catatan));
}

function renderCatatan() {
  const daftar = document.getElementById("daftar-catatan");
  if (catatan.length === 0) {
    daftar.innerHTML = "<li>Belum ada catatan.</li>";
    return;
  }
  daftar.innerHTML = catatan
    .map((teks, i) => `<li>${teks} <button data-indeks="${i}">Hapus</button></li>`)
    .join("");

  daftar.querySelectorAll("button").forEach((tombol) => {
    tombol.addEventListener("click", function () {
      catatan.splice(Number(this.dataset.indeks), 1);
      simpanCatatan();
      renderCatatan();
    });
  });
}

document.getElementById("btn-simpan").addEventListener("click", function () {
  const input = document.getElementById("input-catatan");
  const error = document.getElementById("error-catatan");
  const teks = input.value.trim();

  if (teks.length < 3) {
    error.textContent = "Catatan minimal 3 karakter.";
    return;
  }

  error.textContent = "";
  catatan.push(teks);
  simpanCatatan();
  renderCatatan();
  input.value = "";
});

document.getElementById("btn-bersihkan").addEventListener("click", function () {
  catatan = [];
  localStorage.removeItem(STORAGE_KEY);
  renderCatatan();
});

renderCatatan();

// ========== 3 & 4. Fetch API + search + pagination ==========
const PER_HALAMAN = 5;
let semuaPost = [];
let halamanAktif = 1;
let kataKunci = "";

function tampilkanPost() {
  const hasil = document.getElementById("hasil-api");
  const status = document.getElementById("status-api");

  const terfilter = semuaPost.filter((post) =>
    post.title.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const totalHalaman = Math.max(1, Math.ceil(terfilter.length / PER_HALAMAN));
  if (halamanAktif > totalHalaman) halamanAktif = totalHalaman;

  const mulai = (halamanAktif - 1) * PER_HALAMAN;
  const potongan = terfilter.slice(mulai, mulai + PER_HALAMAN);

  if (terfilter.length === 0) {
    hasil.innerHTML = "<p>Tidak ada post yang cocok.</p>";
  } else {
    hasil.innerHTML = potongan
      .map(
        (post) => `<article style="margin-bottom:10px;">
          <strong>${post.title}</strong>
          <p style="margin:2px 0 0; font-size:0.9rem;">${post.body}</p>
        </article>`
      )
      .join("");
  }

  status.textContent = `Menampilkan ${potongan.length} dari ${terfilter.length} post.`;
  document.getElementById("info-halaman").textContent = ` Halaman ${halamanAktif}/${totalHalaman} `;
}

async function ambilPost() {
  const status = document.getElementById("status-api");
  status.textContent = "Mengambil data...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    semuaPost = await response.json();
    halamanAktif = 1;
    tampilkanPost();
  } catch (err) {
    status.textContent = `Gagal mengambil data: ${err.message}`;
  }
}

document.getElementById("btn-cari").addEventListener("click", function () {
  kataKunci = document.getElementById("input-cari").value.trim();
  halamanAktif = 1;
  tampilkanPost();
});

document.getElementById("btn-prev").addEventListener("click", function () {
  if (halamanAktif > 1) {
    halamanAktif--;
    tampilkanPost();
  }
});

document.getElementById("btn-next").addEventListener("click", function () {
  const terfilter = semuaPost.filter((post) =>
    post.title.toLowerCase().includes(kataKunci.toLowerCase())
  );
  const total = Math.ceil(terfilter.length / PER_HALAMAN);
  if (halamanAktif < total) {
    halamanAktif++;
    tampilkanPost();
  }
});

ambilPost();
