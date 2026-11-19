# Menjalankan pengujian seluruh endpoint RESTful API dengan cURL.
# Hasil transkrip dipakai oleh docs/generate_screenshots.py untuk membuat
# gambar bukti pengujian (screenshot) pada README.
#
# Pemakaian (dari root proyek, server pserve harus sedang berjalan):
#   powershell -ExecutionPolicy Bypass -File docs/api_test.ps1

$base = "http://localhost:6543"

function Write-Section {
    param([string]$Name)
    Write-Output ""
    Write-Output "### SCREENSHOT: $Name"
    Write-Output ""
}

function Show-Json {
    param([string]$Text)

    $python = Join-Path $PSScriptRoot '..\venv\Scripts\python.exe'
    if (Test-Path $python) {
        $pretty = $Text | & $python -c (
            "import json,sys; " +
            "print(json.dumps(json.load(sys.stdin), indent=2, ensure_ascii=False))"
        ) 2>$null
        if ($LASTEXITCODE -eq 0 -and $pretty) {
            Write-Output ($pretty -join "`n")
            return
        }
    }

    try {
        $parsed = $Text | ConvertFrom-Json
        Write-Output ($parsed | ConvertTo-Json -Depth 10)
    } catch {
        Write-Output $Text
    }
}

function Invoke-Api {
    param(
        [string]$Method,
        [string]$Path,
        [string]$Json
    )

    $url = "$base$Path"
    $commandText = "curl -X $Method $url"
    if ($Json) {
        # PowerShell menghapus tanda kutip saat meneruskan argumen ke curl.exe,
        # sehingga payload ditulis ke berkas sementara lalu dikirim via @file.
        $tmpFile = New-TemporaryFile
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($tmpFile.FullName, $Json, $utf8NoBom)

        $commandText += " -H `"Content-Type: application/json`" -d '$Json'"
        $raw = & curl.exe -s -X $Method $url `
            -H "Content-Type: application/json" `
            --data-binary "@$($tmpFile.FullName)" -w "`n%{http_code}"

        Remove-Item $tmpFile.FullName -Force
    } else {
        $raw = & curl.exe -s -X $Method $url -w "`n%{http_code}"
    }

    $lines = $raw -split "`n"
    $status = $lines[-1].Trim()
    $body = ($lines[0..($lines.Count - 2)] -join "`n")

    Write-Output "PS> $commandText"
    Show-Json $body
    Write-Output "HTTP $status"
    Write-Output ""
}

# ---------------------------------------------------------------- Mahasiswa
Write-Section "01_mahasiswa_crud"

Invoke-Api -Method GET -Path "/api/mahasiswa"

Invoke-Api -Method GET -Path "/api/mahasiswa/1"

Invoke-Api -Method POST -Path "/api/mahasiswa" -Json (
    '{"nim":"67890","nama":"Ahmad Fadli","jurusan":"Teknik Elektro",' +
    '"tanggal_lahir":"2001-11-05","alamat":"Jl. Mawar No. 10, Surabaya"}'
)

Invoke-Api -Method PUT -Path "/api/mahasiswa/1" -Json (
    '{"jurusan":"Informatika Medis",' +
    '"alamat":"Jl. Dipati Ukur No. 88, Bandung"}'
)

Invoke-Api -Method DELETE -Path "/api/mahasiswa/3"

Invoke-Api -Method GET -Path "/api/mahasiswa/3"

# --------------------------------------------------------- Validasi Mahasiswa
Write-Section "02_mahasiswa_validation"

Invoke-Api -Method POST -Path "/api/mahasiswa" -Json (
    '{"nama":"Mahasiswa Tanpa NIM","jurusan":"Informatika"}'
)

Invoke-Api -Method POST -Path "/api/mahasiswa" -Json (
    '{"nim":"99999","nama":"Tanggal Salah","jurusan":"Informatika",' +
    '"tanggal_lahir":"05-11-2001"}'
)

# --------------------------------------------------------------- Matakuliah
Write-Section "03_matakuliah_crud"

Invoke-Api -Method GET -Path "/api/matakuliah"

Invoke-Api -Method GET -Path "/api/matakuliah/1"

Invoke-Api -Method POST -Path "/api/matakuliah" -Json (
    '{"kode_mk":"IF4050","nama_mk":"Kecerdasan Buatan",' +
    '"sks":3,"semester":7}'
)

Invoke-Api -Method PUT -Path "/api/matakuliah/1" -Json (
    '{"sks":4,"semester":4}'
)

Invoke-Api -Method DELETE -Path "/api/matakuliah/4"

Invoke-Api -Method GET -Path "/api/matakuliah/4"

# -------------------------------------------------------- Validasi Matakuliah
Write-Section "04_matakuliah_validation"

Invoke-Api -Method POST -Path "/api/matakuliah" -Json (
    '{"nama_mk":"Tanpa Kode","sks":3,"semester":3}'
)

Invoke-Api -Method POST -Path "/api/matakuliah" -Json (
    '{"kode_mk":"IF9999","nama_mk":"SKS Nol","sks":0,"semester":3}'
)

Invoke-Api -Method POST -Path "/api/matakuliah" -Json (
    '{"kode_mk":"IF9999","nama_mk":"Semester Minus","sks":3,"semester":-2}'
)

Invoke-Api -Method POST -Path "/api/matakuliah" -Json (
    '{"kode_mk":"IF2110","nama_mk":"Pemrograman Web","sks":3,"semester":3}'
)
