# Praktikum Pemrograman Web - Pertemuan 6 (Pyramid Framework)

**Nama:** Muhammad Naufal Fikri Akmal
**NIM:** 123140132
**Kelas:** RA
**Mata Kuliah:** Pemrograman Web (Praktikum)

---

## 1. Deskripsi Aplikasi

Aplikasi **RESTful API Manajemen Mahasiswa & Mata Kuliah** dibangun dengan
**Pyramid Framework**, **SQLAlchemy ORM**, migrasi **Alembic**, dan basis data
**PostgreSQL**. Kerangka proyek dihasilkan dari template resmi
`pyramid-cookiecutter-alchemy`.

Aplikasi menyediakan dua modul CRUD berbasis JSON:

| Modul | Endpoint | Keterangan |
|-------|----------|------------|
| **Mahasiswa** | `GET /api/mahasiswa` | Menampilkan seluruh mahasiswa |
| | `GET /api/mahasiswa/{id}` | Detail mahasiswa (404 jika tidak ada) |
| | `POST /api/mahasiswa` | Tambah mahasiswa (400 jika field wajib kosong) |
| | `PUT /api/mahasiswa/{id}` | Ubah data mahasiswa |
| | `DELETE /api/mahasiswa/{id}` | Hapus mahasiswa |
| **Matakuliah** | `GET /api/matakuliah` | Menampilkan seluruh mata kuliah |
| | `GET /api/matakuliah/{id}` | Detail mata kuliah (404 jika tidak ada) |
| | `POST /api/matakuliah` | Tambah mata kuliah (400 jika field wajib kosong) |
| | `PUT /api/matakuliah/{id}` | Ubah data mata kuliah |
| | `DELETE /api/matakuliah/{id}` | Hapus mata kuliah |

Selain endpoint JSON, halaman `GET /` menampilkan daftar seluruh endpoint yang
tersedia dalam bentuk tabel HTML.

### Aturan Validasi

| Modul | Aturan |
|-------|--------|
| Mahasiswa | `nim`, `nama`, `jurusan` wajib diisi; `nim` unik; `tanggal_lahir` harus berformat `YYYY-MM-DD` |
| Matakuliah | `kode_mk`, `nama_mk`, `sks`, `semester` wajib diisi; `sks` dan `semester` bilangan bulat lebih besar dari 0; `kode_mk` unik dan disimpan dalam huruf kapital |

### Arsitektur Lapisan

| Lapisan | Berkas | Fungsi |
|---------|--------|--------|
| Model ORM | `models/mahasiswa.py`, `models/matakuliah.py` | Pemetaan tabel ke class Python + method `to_dict()` |
| Session & Engine | `models/__init__.py` | Engine SQLAlchemy, session factory, `request.dbsession` melalui `pyramid_tm` + `zope.sqlalchemy` |
| Migrasi | `alembic/versions/` | Revisi skema tabel yang di-generate Alembic |
| Seeding | `scripts/initialize_db.py` | Data awal 2 mahasiswa dan 3 mata kuliah |
| Controller | `views/mahasiswa.py`, `views/matakuliah.py` | Logika CRUD, validasi payload, status code HTTP |
| Routing | `routes.py` | URL dispatch dengan predikat `request_method` |

## 2. Teknologi yang Digunakan

| Komponen | Versi / Keterangan |
|----------|--------------------|
| Python | 3.10 atau lebih baru (diuji pada 3.15) |
| Pyramid | 2.1 |
| SQLAlchemy | 2.0.x (dipin `< 2.1` agar `postgresql://` memakai driver psycopg2) |
| Alembic | 1.20 |
| PostgreSQL | 16 (driver `psycopg2-binary`) |
| Waitress | 3.0 (WSGI server bawaan scaffold) |

---

## 3. Struktur Repositori

```text
muhammadnaufalfikriakmal_123140132_pertemuan6/
├── development.ini                  # Konfigurasi server & database development
├── production.ini                   # Konfigurasi server & database production
├── setup.py                         # Metadata & dependensi package
├── pytest.ini                       # Konfigurasi unit test
├── README.md                        # Dokumentasi ini
├── .gitignore                       # venv, *.sqlite, __pycache__, dll
├── docs/
│   ├── api_test.ps1                 # Skrip pengujian seluruh endpoint (cURL)
│   ├── api_test.http                # Koleksi request untuk VS Code REST Client
│   ├── api_test_output.txt          # Transkrip hasil pengujian
│   ├── generate_screenshots.py      # Render transkrip menjadi gambar
│   └── screenshot/                  # Tangkapan layar bukti pengujian
│       ├── 01_mahasiswa_crud.png
│       ├── 02_mahasiswa_validation.png
│       ├── 03_matakuliah_crud.png
│       ├── 04_matakuliah_validation.png
│       ├── 05_database_postgresql.png
│       └── 06_unit_test.png
└── pyramid_mahasiswa/
    ├── __init__.py                  # Entry point WSGI
    ├── routes.py                    # Peta URL dispatch
    ├── pshell.py                    # Setup shell interaktif
    ├── tests.py                     # Unit test CRUD
    ├── alembic/
    │   ├── env.py
    │   ├── script.py.mako
    │   └── versions/
    │       ├── 20261119_create_mahasiswa_table.py
    │       └── 20261119_create_matakuliah_table.py
    ├── models/
    │   ├── __init__.py              # Engine, session factory, registrasi model
    │   ├── meta.py                  # Declarative Base & naming convention
    │   ├── mahasiswa.py             # Model Mahasiswa
    │   └── matakuliah.py            # Model Matakuliah
    ├── scripts/
    │   ├── __init__.py
    │   └── initialize_db.py         # Seeding data awal
    ├── static/
    │   └── style.css
    ├── templates/
    │   ├── layout.jinja2
    │   ├── home.jinja2
    │   └── 404.jinja2
    └── views/
        ├── __init__.py
        ├── default.py               # Halaman utama (daftar endpoint)
        ├── notfound.py              # Handler 404
        ├── mahasiswa.py             # View CRUD mahasiswa
        └── matakuliah.py            # View CRUD mata kuliah
```

---

## 4. Instalasi dan Menjalankan Aplikasi

### 4.1 Prasyarat

- Python 3.10+
- PostgreSQL berjalan pada `localhost:5432`
- Terminal (PowerShell / Bash)

### 4.2 Virtual Environment dan Dependensi

```bash
python -m venv venv

# Windows PowerShell
venv\Scripts\Activate.ps1
# macOS / Linux
source venv/bin/activate

pip install --upgrade pip setuptools
pip install -e ".[testing]"
```

Seluruh dependensi (termasuk `psycopg2-binary`) tercantum pada `setup.py`,
sehingga tidak perlu instalasi terpisah.

### 4.3 Membuat Database PostgreSQL

```sql
psql -U postgres

CREATE DATABASE pyramid_mahasiswa;
CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
GRANT ALL PRIVILEGES ON DATABASE pyramid_mahasiswa TO pyramid_user;

\c pyramid_mahasiswa
GRANT ALL ON SCHEMA public TO pyramid_user;
\q
```

### 4.4 Konfigurasi Koneksi Database

Connection string berada pada `development.ini` dan `production.ini`:

```ini
sqlalchemy.url = postgresql://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa
```

### 4.5 Migrasi Skema dan Seeding Data

```bash
# Terapkan seluruh revisi Alembic (tabel mahasiswa dan matakuliah)
alembic -c development.ini upgrade head

# Masukkan data awal (2 mahasiswa, 3 mata kuliah)
python -m pyramid_mahasiswa.scripts.initialize_db development.ini
```

Perintah migrasi lain yang berguna:

```bash
alembic -c development.ini current
alembic -c development.ini history
alembic -c development.ini downgrade -1
```

### 4.6 Menjalankan Server

```bash
pserve development.ini --reload
```

Server berjalan pada `http://localhost:6543`.

---

## 5. Dokumentasi Endpoint

### 5.1 Mahasiswa

| Method | Path | Body (JSON) | Respons sukses |
|--------|------|-------------|----------------|
| GET | `/api/mahasiswa` | - | `200` `{"mahasiswas": [...]}` |
| GET | `/api/mahasiswa/{id}` | - | `200` `{"mahasiswa": {...}}` |
| POST | `/api/mahasiswa` | `nim`, `nama`, `jurusan`, `tanggal_lahir`, `alamat` | `200` `{"success": true, "mahasiswa": {...}}` |
| PUT | `/api/mahasiswa/{id}` | field yang ingin diubah | `200` `{"success": true, "mahasiswa": {...}}` |
| DELETE | `/api/mahasiswa/{id}` | - | `200` `{"success": true, "message": "..."}` |

Contoh:

```bash
curl -X POST http://localhost:6543/api/mahasiswa \
  -H "Content-Type: application/json" \
  -d '{"nim":"67890","nama":"Ahmad Fadli","jurusan":"Teknik Elektro","tanggal_lahir":"2001-11-05","alamat":"Jl. Mawar No. 10, Surabaya"}'
```

### 5.2 Matakuliah

| Method | Path | Body (JSON) | Respons sukses |
|--------|------|-------------|----------------|
| GET | `/api/matakuliah` | - | `200` `{"matakuliahs": [...]}` |
| GET | `/api/matakuliah/{id}` | - | `200` `{"matakuliah": {...}}` |
| POST | `/api/matakuliah` | `kode_mk`, `nama_mk`, `sks`, `semester` | `200` `{"success": true, "matakuliah": {...}}` |
| PUT | `/api/matakuliah/{id}` | field yang ingin diubah | `200` `{"success": true, "matakuliah": {...}}` |
| DELETE | `/api/matakuliah/{id}` | - | `200` `{"success": true, "message": "..."}` |

Contoh:

```bash
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF4050","nama_mk":"Kecerdasan Buatan","sks":3,"semester":7}'
```

### 5.3 Respons Kesalahan

| Status | Kondisi | Contoh body |
|--------|---------|-------------|
| `400 Bad Request` | field wajib tidak dikirim | `{"error": "Field kode_mk wajib diisi!"}` |
| `400 Bad Request` | `sks` / `semester` tidak valid | `{"error": "Field sks harus lebih besar dari 0!"}` |
| `400 Bad Request` | `kode_mk` duplikat | `{"error": "Kode mata kuliah IF2110 sudah terdaftar"}` |
| `400 Bad Request` | format tanggal salah | `{"error": "Format tanggal lahir tidak valid. Gunakan format YYYY-MM-DD"}` |
| `404 Not Found` | ID tidak ditemukan | `{"error": "Matakuliah dengan ID 4 tidak ditemukan"}` |

`routes.py` mendaftarkan method yang berbeda pada path yang sama menggunakan
predikat `request_method`:

```python
config.add_route('matakuliah_list', '/api/matakuliah', request_method='GET')
config.add_route('matakuliah_add', '/api/matakuliah', request_method='POST')
config.add_route('matakuliah_detail', '/api/matakuliah/{id}', request_method='GET')
config.add_route('matakuliah_update', '/api/matakuliah/{id}', request_method='PUT')
config.add_route('matakuliah_delete', '/api/matakuliah/{id}', request_method='DELETE')
```

---

## 6. Bukti Pengujian (Screenshot)

Pengujian dilakukan terhadap server `pserve` yang berjalan dengan database
PostgreSQL. Transkrip lengkap tersedia pada `docs/api_test_output.txt` dan dapat
diulang dengan:

```bash
powershell -ExecutionPolicy Bypass -File docs/api_test.ps1
```

### 6.1 CRUD Mahasiswa

Menampilkan `GET` seluruh data, `GET` detail ID 1, `POST` data baru (ID 3),
`PUT` ID 1, `DELETE` ID 3, lalu memastikan `GET` ID 3 mengembalikan 404.

![Pengujian CRUD mahasiswa](docs/screenshot/01_mahasiswa_crud.png)

### 6.2 Validasi Mahasiswa

`POST` tanpa field `nim` dan `POST` dengan format tanggal salah sama-sama
mengembalikan `400 Bad Request`.

![Pengujian validasi mahasiswa](docs/screenshot/02_mahasiswa_validation.png)

### 6.3 CRUD Matakuliah

Menampilkan `GET` seluruh data, `GET` detail ID 1, `POST` data baru (ID 4),
`PUT` ID 1, `DELETE` ID 4, lalu memastikan `GET` ID 4 mengembalikan 404.

![Pengujian CRUD matakuliah](docs/screenshot/03_matakuliah_crud.png)

### 6.4 Validasi Matakuliah

Empat skenario `400 Bad Request`: field `kode_mk` kosong, `sks` bernilai 0,
`semester` bernilai negatif, dan `kode_mk` duplikat.

![Pengujian validasi matakuliah](docs/screenshot/04_matakuliah_validation.png)

### 6.5 Verifikasi Data di PostgreSQL

Status revisi Alembic (`current`, `history`) dan isi tabel `mahasiswa` serta
`matakuliah` setelah operasi CRUD, dibaca langsung melalui `psql`.

![Verifikasi data PostgreSQL](docs/screenshot/05_database_postgresql.png)

---

## 7. Unit Test

```bash
pytest -q
```

Delapan unit test mencakup CRUD mahasiswa, CRUD matakuliah, validasi field
wajib, validasi `sks`, `kode_mk` duplikat, serta respons 404.

![Hasil unit test](docs/screenshot/06_unit_test.png)

---

## 8. Catatan

- Seluruh view memakai `request.dbsession` yang terikat ke transaction manager,
  sehingga perubahan otomatis di-commit saat respons sukses dan di-rollback
  ketika terjadi exception.
- `SQLAlchemy` dipin pada `>= 2.0, < 2.1` karena mulai SQLAlchemy 2.1 dialek
  `postgresql://` secara default memakai driver `psycopg` (v3), sedangkan
  praktikum ini memakai `psycopg2-binary` sesuai modul.
- Direktori `venv/`, berkas `*.sqlite`, `__pycache__/`, `.pytest_cache/`, dan
  `*.egg-info/` sudah dikecualikan melalui `.gitignore`.
