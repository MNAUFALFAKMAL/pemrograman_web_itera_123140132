/* =========================================================
   Mini POS - Kasir Kantin
   Logika: validasi form, kalkulator belanja, keranjang + localStorage
   ========================================================= */

// ==================== KONSTANTA & STATE ====================
const STORAGE_KEY = "mini_pos_keranjang_v1";
const DISKON_PORSEN = 0.1;        // 10%
const TOTAL_MINIMAL_DISKON = 50000; // diskon otomatis jika total >= Rp 50.000
const KODE_PROMO_VALID = "HEMAT10";

let keranjang = muatKeranjang();
let kodePromoAktif = "";
let idBarisBaru = null;

// ==================== UTILITAS ====================
const formatRupiah = (nilai) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nilai);

function escapeHtml(teks) {
  const div = document.createElement("div");
  div.textContent = teks;
  return div.innerHTML;
}

// ==================== VALIDASI FORM ====================
function validasiNamaBarang(nilai) {
  const teks = nilai.trim();
  if (teks === "") return "Nama barang wajib diisi.";
  if (teks.length < 3) return "Nama barang minimal 3 karakter.";
  return "";
}

function validasiHarga(nilai) {
  if (nilai === "") return "Harga satuan wajib diisi.";
  const harga = Number(nilai);
  if (!Number.isFinite(harga)) return "Harga satuan harus berupa angka.";
  if (harga <= 0) return "Harga satuan tidak boleh 0 atau negatif.";
  if (harga < 500) return "Harga satuan minimal Rp 500.";
  return "";
}

function validasiJumlah(nilai) {
  if (nilai === "") return "Jumlah wajib diisi.";
  const jumlah = Number(nilai);
  if (!Number.isFinite(jumlah)) return "Jumlah harus berupa angka.";
  if (!Number.isInteger(jumlah)) return "Jumlah harus berupa angka bulat.";
  if (jumlah < 1) return "Jumlah minimal 1.";
  return "";
}

function tampilkanError(idInput, idError, pesan) {
  const input = document.getElementById(idInput);
  const kotak = document.getElementById(idError);
  if (!input || !kotak) return;

  kotak.textContent = pesan;
  kotak.hidden = pesan === "";

  if (pesan) {
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
  } else {
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
  }
}

function bersihkanSemuaError() {
  tampilkanError("nama-barang", "error-nama", "");
  tampilkanError("harga-satuan", "error-harga", "");
  tampilkanError("jumlah", "error-jumlah", "");
  tampilkanError("kode-promo", "error-promo", "");
}

// ==================== KALKULATOR ====================
function hitungSubtotal(item) {
  return item.harga * item.jumlah;
}

function hitungTotalBelanja() {
  return keranjang.reduce((total, item) => total + hitungSubtotal(item), 0);
}

function hitungDiskon(total) {
  const promoBerlaku = kodePromoAktif === KODE_PROMO_VALID;
  const totalMencapaiBatas = total >= TOTAL_MINIMAL_DISKON;
  if (promoBerlaku || totalMencapaiBatas) {
    return Math.round(total * DISKON_PORSEN);
  }
  return 0;
}

function hitungTotalAkhir(total, diskon) {
  return total - diskon;
}

function hitungKembalian(uangBayar, totalAkhir) {
  return uangBayar - totalAkhir;
}

function keteranganDiskon(total) {
  const promoBerlaku = kodePromoAktif === KODE_PROMO_VALID;
  const otomatis = total >= TOTAL_MINIMAL_DISKON;
  if (promoBerlaku && otomatis) return "10% otomatis + HEMAT10";
  if (otomatis) return "10% otomatis (total min. Rp 50.000)";
  if (promoBerlaku) return "10% kode HEMAT10";
  return "";
}

// ==================== PENYIMPANAN (localStorage) ====================
function simpanKeranjang() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));
  } catch (err) {
    console.warn("Gagal menyimpan ke localStorage:", err);
  }
}

function muatKeranjang() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const hasil = JSON.parse(data);
    return Array.isArray(hasil) ? hasil : [];
  } catch (err) {
    console.warn("Gagal memuat dari localStorage:", err);
    return [];
  }
}

function hapusPenyimpanan() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Gagal menghapus localStorage:", err);
  }
}

// ==================== RENDER ====================
function renderTabel() {
  const tbody = document.getElementById("daftar-keranjang");
  const chip = document.getElementById("jumlah-item");
  const totalQty = keranjang.reduce((total, item) => total + item.jumlah, 0);

  if (chip) chip.textContent = `${totalQty} item`;

  if (keranjang.length === 0) {
    tbody.innerHTML = `
      <tr class="baris-kosong">
        <td colspan="6">Keranjang masih kosong. Tambahkan barang pertama lewat form "Tambah Barang".</td>
      </tr>`;
    return;
  }

  tbody.innerHTML = keranjang
    .map((item, index) => {
      const namaAman = escapeHtml(item.nama);
      const baru = item.id === idBarisBaru ? " baris-baru" : "";
      return `
      <tr class="${baru.trim()}">
        <td class="kolom-no">${index + 1}</td>
        <td class="kolom-nama">${namaAman}</td>
        <td class="kolom-angka">${formatRupiah(item.harga)}</td>
        <td class="kolom-angka">${item.jumlah}</td>
        <td class="kolom-angka sel-subtotal">${formatRupiah(hitungSubtotal(item))}</td>
        <td class="kolom-aksi">
          <button type="button" class="btn btn--hapus" data-hapus="${item.id}"
                  aria-label="Hapus ${namaAman} dari keranjang">Hapus</button>
        </td>
      </tr>`;
    })
    .join("");

  idBarisBaru = null;
}

function renderRingkasan() {
  const total = hitungTotalBelanja();
  const diskon = hitungDiskon(total);
  const totalAkhir = hitungTotalAkhir(total, diskon);

  document.getElementById("total-belanja").textContent = formatRupiah(total);
  document.getElementById("diskon").textContent =
    diskon > 0 ? `- ${formatRupiah(diskon)}` : formatRupiah(diskon);
  document.getElementById("total-akhir").textContent = formatRupiah(totalAkhir);
  document.getElementById("diskon-keterangan").textContent = keteranganDiskon(total);
}

function renderPembayaran() {
  const status = document.getElementById("status-pembayaran");
  const inputBayar = document.getElementById("uang-bayar");
  const total = hitungTotalBelanja();
  const totalAkhir = hitungTotalAkhir(total, hitungDiskon(total));

  status.classList.remove("is-ok", "is-kurang");

  if (keranjang.length === 0) {
    status.textContent = "Belum ada transaksi - keranjang kosong.";
    return;
  }

  const nilaiBayar = inputBayar.value.trim();
  if (nilaiBayar === "") {
    status.textContent = `Total yang harus dibayar ${formatRupiah(totalAkhir)}. Masukkan uang bayar.`;
    return;
  }

  const uangBayar = Number(nilaiBayar);
  if (!Number.isFinite(uangBayar) || uangBayar < 0) {
    status.textContent = "Uang bayar harus berupa angka positif.";
    status.classList.add("is-kurang");
    return;
  }

  if (uangBayar < totalAkhir) {
    const kurang = Math.abs(hitungKembalian(uangBayar, totalAkhir));
    status.textContent = `Uang belum mencukupi - kurang ${formatRupiah(kurang)}.`;
    status.classList.add("is-kurang");
  } else {
    const kembalian = hitungKembalian(uangBayar, totalAkhir);
    status.textContent = `Kembalian: ${formatRupiah(kembalian)}`;
    status.classList.add("is-ok");
  }
}

function render() {
  renderTabel();
  renderRingkasan();
  renderPembayaran();
}

// ==================== AKSI KERANJANG ====================
function tambahBarang(data) {
  keranjang.push({
    id: Date.now(),
    nama: data.nama,
    harga: data.harga,
    jumlah: data.jumlah,
  });
  idBarisBaru = keranjang[keranjang.length - 1].id;
  simpanKeranjang();
  render();
}

function hapusBarang(id) {
  keranjang = keranjang.filter((item) => item.id !== id);
  simpanKeranjang();
  render();
}

function transaksiBaru() {
  keranjang = [];
  kodePromoAktif = "";
  idBarisBaru = null;
  hapusPenyimpanan();

  document.getElementById("form-barang").reset();
  document.getElementById("kode-promo").value = "";
  document.getElementById("uang-bayar").value = "";
  document.getElementById("info-promo").textContent = "";
  document.getElementById("form-status").textContent = "";
  document.getElementById("form-status").classList.remove("is-error");
  bersihkanSemuaError();
  render();
}

// ==================== EVENT: FORM TAMBAH BARANG ====================
function pasangValidasiLive(idInput, idError, fungsiValidasi) {
  const input = document.getElementById(idInput);
  input.addEventListener("input", () => {
    // Validasi ulang hanya jika kotak error sedang tampil
    if (!document.getElementById(idError).hidden) {
      tampilkanError(idInput, idError, fungsiValidasi(input.value));
    }
  });
}

function initFormBarang() {
  const form = document.getElementById("form-barang");
  const status = document.getElementById("form-status");

  pasangValidasiLive("nama-barang", "error-nama", validasiNamaBarang);
  pasangValidasiLive("harga-satuan", "error-harga", validasiHarga);
  pasangValidasiLive("jumlah", "error-jumlah", validasiJumlah);

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // cegah reload halaman

    const nama = document.getElementById("nama-barang").value;
    const harga = document.getElementById("harga-satuan").value;
    const jumlah = document.getElementById("jumlah").value;

    const errNama = validasiNamaBarang(nama);
    const errHarga = validasiHarga(harga);
    const errJumlah = validasiJumlah(jumlah);

    tampilkanError("nama-barang", "error-nama", errNama);
    tampilkanError("harga-satuan", "error-harga", errHarga);
    tampilkanError("jumlah", "error-jumlah", errJumlah);

    if (errNama || errHarga || errJumlah) {
      // Barang TIDAK masuk keranjang
      status.textContent = "Data belum valid - periksa input yang ditandai merah.";
      status.classList.add("is-error");
      const pertamaError = [errNama && "nama-barang", errHarga && "harga-satuan", errJumlah && "jumlah"]
        .find((id) => id);
      document.getElementById(pertamaError).focus();
      return;
    }

    tambahBarang({
      nama: nama.trim(),
      harga: Number(harga),
      jumlah: Number(jumlah),
    });

    // Form otomatis di-reset
    form.reset();
    status.classList.remove("is-error");
    status.textContent = `${nama.trim()} berhasil ditambahkan ke keranjang.`;
    document.getElementById("nama-barang").focus();
  });
}

// ==================== EVENT: HAPUS ITEM (delegasi) ====================
function initTabelKeranjang() {
  document.getElementById("daftar-keranjang").addEventListener("click", (event) => {
    const tombol = event.target.closest("[data-hapus]");
    if (!tombol) return;
    hapusBarang(Number(tombol.dataset.hapus));
  });
}

// ==================== EVENT: PROMO ====================
function initPromo() {
  const input = document.getElementById("kode-promo");
  const tombol = document.getElementById("btn-promo");
  const info = document.getElementById("info-promo");

  const terapkanPromo = () => {
    const kode = input.value.trim().toUpperCase();

    if (kode === "") {
      kodePromoAktif = "";
      tampilkanError("kode-promo", "error-promo", "");
      info.textContent = "";
    } else if (kode === KODE_PROMO_VALID) {
      kodePromoAktif = kode;
      tampilkanError("kode-promo", "error-promo", "");
      info.textContent = `Kode ${KODE_PROMO_VALID} aktif - diskon 10%.`;
    } else {
      kodePromoAktif = "";
      tampilkanError("kode-promo", "error-promo", `Kode promo tidak valid. Coba ${KODE_PROMO_VALID}.`);
      info.textContent = "";
    }

    renderRingkasan();
    renderPembayaran();
  };

  tombol.addEventListener("click", terapkanPromo);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      terapkanPromo();
    }
  });
}

// ==================== EVENT: UANG BAYAR ====================
function initPembayaran() {
  document.getElementById("uang-bayar").addEventListener("input", renderPembayaran);
}

// ==================== EVENT: TRANSAKSI BARU ====================
function initTransaksiBaru() {
  document.getElementById("btn-transaksi-baru").addEventListener("click", () => {
    if (keranjang.length > 0) {
      const yakin = window.confirm("Kosongkan seluruh keranjang dan mulai transaksi baru?");
      if (!yakin) return;
    }
    transaksiBaru();
  });
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  initFormBarang();
  initTabelKeranjang();
  initPromo();
  initPembayaran();
  initTransaksiBaru();
  render();
});
