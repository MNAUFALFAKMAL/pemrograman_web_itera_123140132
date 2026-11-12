# ==============================================================================
# Berkas: generate_screenshot.py
# Deskripsi: Menjalankan main.py dan me-render output-nya menjadi gambar PNG
#            bergaya terminal (dark theme) untuk dokumentasi README.
# ==============================================================================

import subprocess
import sys
import os
from PIL import Image, ImageDraw, ImageFont


def ambil_output_program():
    """Menjalankan main.py dan mengembalikan output terminal (stdout + stderr)."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    main_path = os.path.join(base_dir, "tugas_perpustakaan", "main.py")

    # Paksa encoding UTF-8 agar karakter & format rapi
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"

    result = subprocess.run(
        [sys.executable, main_path],
        capture_output=True,
        text=True,
        encoding="utf-8",
        env=env,
        cwd=os.path.join(base_dir, "tugas_perpustakaan"),
    )

    output = result.stdout
    if result.stderr:
        output += "\n[STDERR]\n" + result.stderr
    return output


def render_terminal_image(teks: str, output_path: str):
    """Render teks output menjadi gambar PNG yang tampak seperti terminal."""
    font_path = r"C:\Windows\Fonts\consola.ttf"
    font_size = 15
    line_spacing = 1.45

    font = ImageFont.truetype(font_path, font_size)

    # --- Warna tema terminal (VS Code Dark+) ---
    bg_color = (30, 30, 30)          # background gelap
    titlebar_color = (45, 45, 45)    # title bar
    text_color = (212, 212, 212)     # teks abu terang
    dot_red = (255, 95, 86)
    dot_yellow = (255, 189, 46)
    dot_green = (39, 201, 63)

    lines = teks.replace("\t", "    ").split("\n")

    # Hitung dimensi gambar berdasarkan teks
    char_width = font.getlength("M")  # lebar karakter monospace
    line_height = int(font_size * line_spacing)

    padding_x = 28
    padding_y = 22
    titlebar_height = 42
    max_line_len = max((len(l) for l in lines), default=1)

    content_width = int(char_width * max_line_len) + padding_x * 2
    content_height = line_height * len(lines) + padding_y * 2

    img_width = max(900, min(content_width, 2000))
    img_height = content_height + titlebar_height

    img = Image.new("RGB", (img_width, img_height), bg_color)
    draw = ImageDraw.Draw(img)

    # --- Gambar title bar ala macOS/VS Code ---
    draw.rectangle([0, 0, img_width, titlebar_height], fill=titlebar_color)
    # Tiga tombol bulat (merah, kuning, hijau)
    r = 6
    cy = titlebar_height // 2
    for i, color in enumerate([dot_red, dot_yellow, dot_green]):
        cx = 20 + i * 22
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)

    # Judul terminal
    draw.text(
        (img_width // 2 - 130, cy - 9),
        "terminal — python tugas_perpustakaan/main.py",
        font=ImageFont.truetype(font_path, 12),
        fill=(160, 160, 160),
    )

    # --- Render tiap baris teks ---
    y = titlebar_height + padding_y
    for line in lines:
        color = text_color
        # Beri warna khusus untuk penanda status agar lebih hidup
        if "[SUKSES]" in line:
            color = (106, 190, 120)
        elif "[PERINGATAN]" in line or "[GAGAL]" in line:
            color = (230, 180, 90)
        elif "[INFO]" in line:
            color = (100, 170, 230)
        elif line.strip().startswith("===") or set(line.strip()) == {"="}:
            color = (120, 120, 120)
        elif line.strip().startswith("---"):
            color = (110, 110, 110)

        draw.text((padding_x, y), line, font=font, fill=color)
        y += line_height

    img.save(output_path, "PNG")
    print(f"[OK] Gambar tersimpan: {output_path}")
    print(f"     Ukuran: {img_width}x{img_height} px")


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_txt = os.path.join(base_dir, "screenshot", "output.txt")
    output_png = os.path.join(base_dir, "screenshot", "output.png")

    os.makedirs(os.path.join(base_dir, "screenshot"), exist_ok=True)

    print("Menjalankan main.py dan mengambil output...")
    teks = ambil_output_program()

    # Simpan juga versi teks (UTF-8) untuk backup
    with open(output_txt, "w", encoding="utf-8") as f:
        f.write(teks)
    print(f"[OK] Output teks tersimpan: {output_txt}")

    render_terminal_image(teks, output_png)


if __name__ == "__main__":
    main()