"""Render transkrip pengujian API menjadi gambar PNG (bukti pengujian).

Pemakaian:
    python docs/generate_screenshots.py docs/api_test_output.txt

Transkrip dibagi menjadi beberapa gambar berdasarkan penanda baris
``### SCREENSHOT: <nama>``. Setiap potongan dirender dengan latar gelap
menyerupai terminal.
"""

import os
import sys

from PIL import Image, ImageDraw, ImageFont

FONT_REGULAR = r"C:\Windows\Fonts\consola.ttf"
FONT_BOLD = r"C:\Windows\Fonts\consolab.ttf"

FONT_SIZE = 15
LINE_HEIGHT = 20
PADDING_X = 24
PADDING_Y = 20
MAX_WIDTH = 1400

COLOR_BG = (24, 27, 31)
COLOR_BAR = (38, 42, 48)
COLOR_TEXT = (220, 223, 228)
COLOR_COMMAND = (126, 214, 142)
COLOR_STATUS_OK = (108, 190, 240)
COLOR_STATUS_ERROR = (240, 150, 110)
COLOR_TITLE = (170, 176, 186)


def load_font(path):
    return ImageFont.truetype(path, FONT_SIZE)


def split_sections(lines):
    sections = []
    current_name = None
    current_lines = []

    for line in lines:
        if line.startswith('### SCREENSHOT:'):
            if current_name is not None:
                sections.append((current_name, current_lines))
            current_name = line.split(':', 1)[1].strip()
            current_lines = []
        elif current_name is not None:
            current_lines.append(line.rstrip())

    if current_name is not None:
        sections.append((current_name, current_lines))

    return sections


def render(name, lines, output_dir):
    font = load_font(FONT_REGULAR)
    font_bold = load_font(FONT_BOLD)

    # buang baris kosong di awal/akhir
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()

    measure = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    text_width = max([measure.textlength(line, font=font) for line in lines])
    width = int(min(MAX_WIDTH, max(700, text_width + PADDING_X * 2)))

    height = PADDING_Y * 2 + 34 + len(lines) * LINE_HEIGHT
    image = Image.new('RGB', (width, height), COLOR_BG)
    draw = ImageDraw.Draw(image)

    draw.rectangle([0, 0, width, 30], fill=COLOR_BAR)
    for index, color in enumerate(
            [(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        cx = 18 + index * 20
        draw.ellipse([cx - 6, 9, cx + 6, 21], fill=color)
    draw.text((width // 2 - 120, 7), "Terminal - pengujian REST API",
              font=font, fill=COLOR_TITLE)

    y = 30 + PADDING_Y
    for line in lines:
        color = COLOR_TEXT
        used_font = font
        if line.startswith('PS>'):
            color = COLOR_COMMAND
            used_font = font_bold
        elif line.startswith('HTTP 2'):
            color = COLOR_STATUS_OK
        elif line.startswith('HTTP 4') or line.startswith('HTTP 5'):
            color = COLOR_STATUS_ERROR

        draw.text((PADDING_X, y), line, font=used_font, fill=color)
        y += LINE_HEIGHT

    os.makedirs(output_dir, exist_ok=True)
    path = os.path.join(output_dir, f'{name}.png')
    image.save(path)
    print(f'  tersimpan: {path}')


def read_text(path):
    """Baca transkrip dan normalisasi penyimpanan ke UTF-8."""
    with open(path, 'rb') as handle:
        raw = handle.read()

    for encoding in ('utf-8-sig', 'utf-16', 'cp1252'):
        try:
            text = raw.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    else:
        raise SystemExit(f'Gagal membaca transkrip: {path}')

    # PowerShell 5.1 menulis hasil redirect sebagai UTF-16; simpan ulang UTF-8
    with open(path, 'w', encoding='utf-8', newline='') as handle:
        handle.write(text)

    return text


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    transcript = sys.argv[1]
    output_dir = os.path.join(os.path.dirname(transcript), 'screenshot')

    lines = read_text(transcript).splitlines()

    for name, section_lines in split_sections(lines):
        render(name, section_lines, output_dir)

    return 0


if __name__ == '__main__':
    sys.exit(main())
