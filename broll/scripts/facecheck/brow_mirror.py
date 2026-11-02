# Fuller image-right eyebrow: mirror the image-left eyebrow's hair (darkness only) onto the right brow via an
# affine fit of the 6 Vision eyebrow points, then the mild hair darkening from brow_fix.
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from brow_fix import fix, grow

def mirror(img, L, R, strength=0.75, sy=1.6, blur=3.5):
    W, H = img.size
    Lx = [p[0] for p in L]; Ly = [p[1] for p in L]
    pad = 30
    lx0, ly0, lx1, ly1 = int(min(Lx) - pad), int(min(Ly) - pad), int(max(Lx) + pad), int(max(Ly) + pad)
    patch = img.crop((lx0, ly0, lx1, ly1)).transpose(Image.FLIP_LEFT_RIGHT)
    pw = lx1 - lx0
    srcpts = np.array([(pw - (x - lx0), y - ly0) for x, y in L])  # L points in flipped-patch coords
    Rx = [p[0] for p in R]; Ry = [p[1] for p in R]
    rx0, ry0, rx1, ry1 = int(min(Rx) - pad), int(min(Ry) - pad), int(max(Rx) + pad), int(max(Ry) + pad)
    dst = np.array([(x - rx0, y - ry0) for x, y in R])
    # affine: dst-crop coords -> flipped-patch coords (PIL wants the inverse map)
    X = np.hstack([dst, np.ones((len(dst), 1))])
    cx, _, _, _ = np.linalg.lstsq(X, srcpts[:, 0], rcond=None)
    cy, _, _, _ = np.linalg.lstsq(X, srcpts[:, 1], rcond=None)
    size = (rx1 - rx0, ry1 - ry0)
    warped = np.asarray(patch.transform(size, Image.AFFINE, (*cx, *cy), resample=Image.BICUBIC)).astype(np.float32)
    # darkness of the mirrored hair relative to its own skin
    wl = warped.mean(axis=2)
    skin = np.percentile(wl, 75)
    d = np.clip(skin - wl, 0, None)[..., None]  # hair = positive
    m = Image.new("L", size, 0)
    ccx, ccy = np.mean(dst[:, 0]), np.mean(dst[:, 1])
    ImageDraw.Draw(m).polygon([tuple(p) for p in grow([tuple(p) for p in dst], ccx, ccy, sx=1.1, sy=sy, dy=-0.5)], fill=255)
    mm = np.asarray(m.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32)[..., None] / 255.0
    crop = np.asarray(img.crop((rx0, ry0, rx1, ry1))).astype(np.float32)
    # darken toward brown, proportional to hair darkness (keeps skin colour where there is no hair)
    tint = np.array([1.0, 1.12, 1.25], np.float32)  # pull blue/green down a bit less → warm brown, not grey
    out = crop - d / tint * strength * mm
    img.paste(Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)), (rx0, ry0))
    return img

def fuller(img, L, R, strength=0.75, amt=0.6):
    mirror(img, L, R, strength)
    fix(img, R, amt)
    return img
