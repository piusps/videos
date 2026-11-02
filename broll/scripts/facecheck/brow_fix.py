# Strengthen the faint image-right eyebrow: feathered mask from Vision eyebrow polygon,
# darken (stronger where pixels are already hair-dark) + boost hair detail.
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def grow(poly, cx, cy, sx=1.08, sy=1.45, dy=-0.5):
    return [((x - cx) * sx + cx, (y - cy) * sy + cy + dy) for x, y in poly]

def fix(img, poly, amt=1.0, base=0.05, sy=1.45, blur=4):
    W, H = img.size
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    cx, cy = sum(xs) / len(xs), sum(ys) / len(ys)
    pad = 40
    x0, y0, x1, y1 = int(min(xs) - pad), int(min(ys) - pad), int(max(xs) + pad), int(max(ys) + pad)
    crop = img.crop((x0, y0, x1, y1))
    m = Image.new("L", crop.size, 0)
    ImageDraw.Draw(m).polygon([(x - x0, y - y0) for x, y in grow(poly, cx, cy, sy=sy)], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(crop).astype(np.float32)
    mm = np.asarray(m).astype(np.float32)[..., None] / 255.0
    lum = a.mean(axis=2, keepdims=True)
    ring = (mm[..., 0] < 0.05)
    skin = np.median(lum[ring]) if ring.any() else lum.mean()
    hair = np.clip((skin - lum - 4) / 22.0, 0, 1)
    hair = np.asarray(Image.fromarray((hair[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)[..., None] / 255.0
    blur = np.asarray(crop.filter(ImageFilter.GaussianBlur(3))).astype(np.float32)
    detail = a - blur
    k = np.clip(mm * (base + 0.6 * hair) * amt, 0, 0.85)
    brown = np.array([62, 44, 36], np.float32)  # dark brown like his other brow / hair
    out = a * (1 - k) + brown * k + detail * 0.5 * mm * amt
    img.paste(Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)), (x0, y0))
    return img
