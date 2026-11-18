"""Write photos.json, the list of photos the wall under CONTACT shows (read by scripts/photos.js).

    python3 tools/build_photos.py                 local preview: list photos/ as it is
    python3 tools/build_photos.py --convert DIR   deploy (GitHub Action): also turn DIR/photos/ into resized WebP

Any .jpg/.jpeg/.png/.webp in photos/ is picked up; delete a file and it is gone from the site on the next push.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

EXTS = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_SIDE = 2000

convert = '--convert' in sys.argv
root = Path(sys.argv[2]) if convert else Path(__file__).resolve().parent.parent
photos = root / 'photos'

entries = []
for path in sorted(p for p in photos.iterdir() if p.suffix.lower() in EXTS):
    with Image.open(path) as opened:
        img = ImageOps.exif_transpose(opened)
        if convert and (path.suffix.lower() != '.webp' or max(img.size) > MAX_SIDE):
            img.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
            out = path.with_suffix('.webp')
            img.convert('RGB').save(out, 'WEBP', quality=80, method=6)
            if out != path:
                path.unlink()
            path = out
        w, h = img.size
    entries.append({'src': path.name, 'ratio': round(w / h, 3)})

(root / 'photos.json').write_text(json.dumps(entries, indent=1))
print(f'{len(entries)} photos -> {root / "photos.json"}')
