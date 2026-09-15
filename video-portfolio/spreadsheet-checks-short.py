"""Original 30-second vertical motion-graphic portfolio sample.

Brief: '3 spreadsheet checks before you send', useful general advice, all copy
and vector-like graphics original, no client data or third-party media. Silent;
captions are baked into the picture. Created by Receipt Work (AI assistant).

Dependencies: Python 3, Pillow, ffmpeg with libx264. No network is used.
Run: python3 spreadsheet-checks-short.py
"""

from pathlib import Path
import math
import shutil
import subprocess
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
OUT = HERE / 'spreadsheet-checks-short.mp4'
W, H, FPS, SECONDS = 1080, 1920, 30, 30
INK = '#13352F'
CREAM = '#FAF6EB'
MINT = '#BAEBCF'
OCHRE = '#EDBA75'
MUTED = '#84A79A'
PALE = '#E3EBDC'
FONT_DIR = Path('/System/Library/Fonts/Supplemental')


def font(size, bold=False):
    name = 'Arial Bold.ttf' if bold else 'Arial.ttf'
    return ImageFont.truetype(str(FONT_DIR / name), size)


FONTS = {(n, b): font(n, b) for n in [26, 30, 34, 38, 40, 44, 48, 50, 52,
                                    58, 60, 70, 80, 98, 106, 112, 120, 128]
         for b in [False, True]}


def txt(d, xy, text, size=44, bold=False, fill=CREAM):
    d.text(xy, text, font=FONTS[size, bold], fill=fill, anchor='lt')


def rr(d, box, radius=24, fill=CREAM, outline=None, width=1):
    d.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)


def check(d, x, y, size=36, fill=INK, width=8):
    d.line([(x, y+size*.5), (x+size*.32, y+size*.85), (x+size, y)],
           fill=fill, width=width, joint='curve')


def title(d, a, b, size=120):
    txt(d, (88, 330), a, size, True)
    txt(d, (88, 466), b, size, True, MINT)


def numbered_header(d, n):
    rr(d, (88, 215, 218, 282), 33, MINT)
    txt(d, (117, 229), f'0{n}', 40, True, INK)
    txt(d, (246, 235), 'OF 03', 30, True, MUTED)


def scene(index):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if index == 0:
        txt(d, (88, 251), 'Before you', 98, True)
        txt(d, (88, 372), 'hit send...', 98, True, MINT)
        txt(d, (82, 599), '3', 128, True, OCHRE)
        txt(d, (208, 617), 'spreadsheet', 70, True)
        txt(d, (208, 704), 'checks', 70, True)
        txt(d, (88, 834), 'A cleaner handoff in 30 seconds.', 44)
        labels = [('01', 'Totals'), ('02', 'Gaps'), ('03', 'Duplicates')]
        for y, (n, label) in zip([1030, 1164, 1298], labels):
            rr(d, (88, y, 992, y+102), 22, '#214C40')
            txt(d, (124, y+31), n, 40, True, OCHRE)
            txt(d, (233, y+29), label, 44, True)
    elif index == 1:
        numbered_header(d, 1)
        title(d, 'Check the', 'totals.')
        txt(d, (88, 646), 'Recalculate formulas.', 50)
        txt(d, (88, 716), 'Match totals to your source.', 44)
        rr(d, (88, 890, 992, 1410), 30, CREAM)
        txt(d, (126, 934), 'EXAMPLE TOTALS', 30, True, INK)
        rr(d, (124, 1010, 504, 1310), 24, PALE)
        rr(d, (574, 1010, 954, 1310), 24, MINT)
        txt(d, (159, 1044), 'SOURCE', 30, True, INK)
        txt(d, (609, 1044), 'SHEET', 30, True, INK)
        txt(d, (188, 1112), '60', 106, True, INK)
        txt(d, (638, 1112), '60', 106, True, INK)
        txt(d, (164, 1241), '12 + 18 + 30', 34, False, INK)
        txt(d, (633, 1241), 'Recalculated', 30, False, INK)
        txt(d, (129, 1345), 'A matching total is a useful first check.', 34, False, INK)
    elif index == 2:
        numbered_header(d, 2)
        title(d, 'Find the', 'gaps.')
        txt(d, (88, 646), 'Filter required fields for blanks.', 44)
        txt(d, (88, 716), 'Check date and unit formats.', 44)
        rr(d, (88, 890, 992, 1410), 30, CREAM)
        txt(d, (128, 936), 'REQUIRED FIELD', 30, True, INK)
        txt(d, (734, 936), 'STATUS', 30, True, INK)
        for y, row, value in [(1010, 'Row 12', 'Filled'),
                              (1124, 'Row 13', 'Blank'),
                              (1238, 'Row 14', 'Filled')]:
            rr(d, (120, y, 960, y+91), 13, OCHRE if value=='Blank' else PALE)
            txt(d, (145, y+27), row, 34, False, INK)
            if value == 'Blank':
                d.line((390, y+64, 637, y+64), fill=INK, width=3)
            else:
                rr(d, (390, y+25, 636, y+58), 5, '#AEC0A7')
            txt(d, (734, y+27), value, 34, True, INK)
        txt(d, (128, 1351), 'Review the fields that must be complete.', 34, False, INK)
    elif index == 3:
        numbered_header(d, 3)
        title(d, 'Review', 'duplicates.', 106)
        txt(d, (88, 646), 'Compare the unique ID column.', 44)
        txt(d, (88, 716), 'Check repeats before deleting.', 44)
        rr(d, (88, 890, 992, 1410), 30, CREAM)
        txt(d, (130, 936), 'EXAMPLE ID', 30, True, INK)
        txt(d, (690, 936), 'REVIEW', 30, True, INK)
        for y, val, repeat in [(1010, 'A-104', True),
                              (1124, 'A-105', False),
                              (1238, 'A-104', True)]:
            rr(d, (120, y, 960, y+91), 13, OCHRE if repeat else PALE)
            txt(d, (156, y+25), val, 40, True, INK)
            txt(d, (690, y+29), 'Repeated' if repeat else 'Unique', 34,
                True, INK)
        txt(d, (128, 1351), 'A repeat needs context, not automatic removal.', 30, False, INK)
    else:
        txt(d, (88, 294), 'Ready for a', 98, True)
        txt(d, (88, 417), 'final look?', 98, True, MINT)
        for y, label in [(697, 'Totals match'), (884, 'Gaps checked'),
                         (1071, 'Repeats reviewed')]:
            rr(d, (88, y, 992, y+128), 26, '#214C40')
            check(d, 127, y+46, 48, MINT, 10)
            txt(d, (230, y+39), label, 50, True)
        txt(d, (88, 1347), 'Then send with confidence.', 48)
    return im


SCENES = [scene(i) for i in range(5)]
CUTS = [0, 3, 10, 17, 25, 30]


def frame(t):
    im = Image.new('RGB', (W, H), INK)
    d = ImageDraw.Draw(im)
    # Quiet background rules and a moving dot give the layout restrained motion.
    for y in range(210, 1660, 88):
        d.line((1030, y, 1080, y), fill='#285044', width=2)
    txt(d, (88, 113), 'SPREADSHEET CHECKS', 30, True, MINT)
    d.line((88, 173, 992, 173), fill='#446D5E', width=2)
    idx = next(i for i in range(5) if CUTS[i] <= t < CUTS[i+1])
    elapsed, remaining = t-CUTS[idx], CUTS[idx+1]-t
    incoming = min(1, elapsed/.40) if idx else 1
    outgoing = min(1, remaining/.24) if idx < 4 else 1
    alpha = max(0, incoming*outgoing)
    layer = SCENES[idx]
    if alpha < 1:
        layer = layer.copy()
        layer.putalpha(layer.getchannel('A').point(lambda a: int(a*alpha)))
    shift = int(35*(1-incoming)**2 - 14*(1-outgoing))
    im.paste(layer, (0, shift), layer)
    d = ImageDraw.Draw(im)
    if idx == 1 and elapsed > 1.4:
        scale = min(1, (elapsed-1.4)/.5)
        rr(d, (476, 1095, 604, 1219), 62, INK)
        check(d, 511, 1134, 57*scale, MINT, 9)
    if idx == 2 and elapsed > .6:
        pulse = int(3 + 2*(.5+.5*math.sin(t*3)))
        rr(d, (377, 1139, 651, 1203), 8, None, INK, pulse)
    if idx == 3 and elapsed > .6:
        pulse = int(3 + 2*(.5+.5*math.sin(t*2.5)))
        rr(d, (141, 1027, 329, 1084), 10, None, INK, pulse)
        rr(d, (141, 1255, 329, 1312), 10, None, INK, pulse)
    # Bottom caption and progress indicator stay inside common mobile safe areas.
    txt(d, (88, 1598), 'Receipt Work • AI-assisted sample', 30, False, MUTED)
    rr(d, (88, 1690, 992, 1700), 5, '#31594C')
    rr(d, (88, 1690, 88+max(10, int(904*t/SECONDS)), 1700), 5, MINT)
    for j in range(1, 4):
        x = 88 + int(904*CUTS[j]/SECONDS)
        d.line((x, 1685, x, 1706), fill=CREAM, width=2)
    txt(d, (88, 1737), f'{min(30, int(t)):02d} / 30 SEC', 26, False, MUTED)
    return im


def main():
    exe = shutil.which('ffmpeg')
    if not exe:
        raise SystemExit('ffmpeg is unavailable; no paid installation attempted.')
    cmd = [exe, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
           '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264',
           '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p',
           '-movflags', '+faststart', '-metadata',
           'title=3 spreadsheet checks before you send', '-metadata',
           'comment=Original AI-assisted portfolio sample; no client data.', str(OUT)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    try:
        for i in range(FPS*SECONDS):
            proc.stdin.write(frame(i/FPS).tobytes())
            if i % (FPS*5) == 0:
                print(f'Rendered {i//FPS}/{SECONDS} seconds', flush=True)
    finally:
        proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit('ffmpeg encoding failed')
    print(OUT, flush=True)


if __name__ == '__main__':
    main()
