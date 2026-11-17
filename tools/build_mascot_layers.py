"""Knipt public/mascot.png in lagen voor de animatie (uiterlijk blijft pixel-voor-pixel gelijk)."""
from PIL import Image, ImageDraw
import json, math
SRC = "public/mascot.png"
im = Image.open(SRC).convert("RGBA"); W, H = im.size
px = im.load()
MINT = px[200, 176][:3]  # effen muntkleur in het gezicht
WHITE = (255, 255, 255, 255)

def is_white(p): return p[3] > 0 and min(p[:3]) > 236

def poly_mask(pts):
    m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).polygon(pts, fill=255); return m
def circle_mask(cx, cy, r):
    m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).ellipse([cx-r, cy-r, cx+r, cy+r], fill=255); return m
def union(a, b):
    from PIL import ImageChops; return ImageChops.lighter(a, b)

base = im.copy()
layers = {}

def cut(name, region_mask, base_mask=None, pivot=(0, 0), only_nonwhite=True, fill=WHITE, pad=0):
    """overlay = pixels in region (optioneel alleen niet-wit); base = zelfde pixels weg (base_mask) en opgevuld"""
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bm = base_mask or region_mask
    for y in range(H):
        for x in range(W):
            if region_mask.getpixel((x, y)):
                p = px[x, y]
                if p[3] and (not only_nonwhite or not is_white(p)):
                    ov.putpixel((x, y), p)
    for y in range(H):
        for x in range(W):
            if bm.getpixel((x, y)):
                p = px[x, y]
                if p[3] and (not only_nonwhite or not is_white(p)):
                    base.putpixel((x, y), (fill[0], fill[1], fill[2], 255))
    bb = ov.getbbox(); crop = ov.crop(bb)
    crop.save(f"public/mascot/{name}.png")
    layers[name] = dict(x=bb[0]/W*100, y=bb[1]/H*100, w=(bb[2]-bb[0])/W*100, h=(bb[3]-bb[1])/H*100,
                        ox=(pivot[0]-bb[0])/(bb[2]-bb[0])*100, oy=(pivot[1]-bb[1])/(bb[3]-bb[1])*100)

# antenne: bal + steel tot net in de gele kap
ant = union(circle_mask(245.5, 33.5, 19), poly_mask([(225, 40), (250, 40), (250, 80), (225, 80)]))
ant_base = union(circle_mask(245.5, 33.5, 19), poly_mask([(225, 40), (250, 40), (250, 74), (225, 74)]))
cut("antenna", ant, ant_base, pivot=(238, 78))

# hand: vingers + handpalm; overlay 5px dieper dan wat uit de basis verdwijnt
hand = [(8,158),(112,158),(112,243),(98,246),(98,268),(46,268),(46,250),(8,250)]
hand_base = [(8,158),(112,158),(112,243),(98,246),(98,262),(46,262),(46,250),(8,250)]
cut("hand", poly_mask(hand), poly_mask(hand_base), pivot=(72, 256))

# ogen: dichtgeknepen = knipper
for n, (cx, cy) in {"eyeL": (184.5, 170), "eyeR": (251, 175.5)}.items():
    m = circle_mask(cx, cy, 14)
    cut(n, m, m, pivot=(cx, cy), only_nonwhite=False, fill=MINT)

base.save("public/mascot/base.png")
json.dump(layers, open("public/mascot/layers.json", "w"), indent=1)
print(json.dumps(layers, indent=1))
