"""Bouwt public/mascot.svg: Koens robot gevectoriseerd (4x opgeschaald, vlakke kleuren),
in lagen (romp, antenne, zwaaiende hand, ogen) met eigen stickerrand per laag en CSS-animatie in de SVG zelf.
Invoer: lab2.npy (labelkaart) uit de kwantiseerstap."""
import sys, re, numpy as np, cv2, vtracer
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
W = sys.argv[1] if len(sys.argv) > 1 else "/tmp/mv"
lab = np.load(f"{W}/lab2.npy"); H_, W_ = lab.shape
COL = {0: "#111111", 1: "#9EDBB8", 2: "#FDFEFD", 3: "#99B1B3", 4: "#D3BEE3", 5: "#EFD376"}
SHADOW, HAIR, WHITE = "#7FB69A", "#D9D9D9", "#FFFFFF"

# 1. randen gladmaken: per klasse vervagen en stemmen
oh = np.stack([(lab == k).astype(np.float32) for k in range(6)] + [(lab == 255).astype(np.float32)], -1)
oh = np.stack([cv2.GaussianBlur(oh[..., i], (0, 0), 2.2) for i in range(7)], -1)
lab = np.array([0, 1, 2, 3, 4, 5, 255], np.uint8)[oh.argmax(-1)]
sil = lab != 255

def poly(pts):
    m = Image.new("L", (W_, H_), 0); ImageDraw.Draw(m).polygon(pts, fill=1); return np.array(m) > 0

# 2. lagen
ant_reg = sil & poly([(860, 0), (1040, 0), (1040, 290), (860, 290)])
ant_rm = sil & poly([(860, 0), (1040, 0), (1040, 276), (860, 276)])
hand_reg = sil & poly([(30, 690), (452, 690), (458, 880), (442, 930), (402, 965), (370, 982), (332, 1022), (270, 1038), (205, 1027), (168, 1002), (30, 1002)])
# hand = handpalm/vingers (mint-vlakken die binnen de knipregio liggen) + hun eigen omlijning
ml, nm = ndi.label(lab == 1)
palm = np.zeros_like(sil)
for i in np.unique(ml[hand_reg & (lab == 1)]):
    if i == 0: continue
    comp = ml == i
    if (comp & hand_reg).sum() / comp.sum() > 0.95: palm |= comp
d_palm = ndi.distance_transform_edt(~palm)
arm_mint = (lab != 0) & sil & ~palm & ~hand_reg | ((lab != 0) & sil & ~palm & hand_reg & (d_palm > 30))
d_arm = ndi.distance_transform_edt(~arm_mint)
near_poly = ndi.binary_dilation(hand_reg, iterations=40)
hand_reg = palm | ((lab == 0) & (d_palm < 24) & near_poly)
hand_reg = ndi.binary_fill_holes(hand_reg) & sil
shared = (lab == 0) & (d_arm < 20)
hand_rm = hand_reg & ~shared
P_HAND = tuple(int(v) for v in np.argwhere(hand_reg & shared).mean(0)[::-1])
# ogen: ronde zwarte vlekken in het hoofd
bl, n = ndi.label(lab == 0); eyes = np.zeros_like(sil)
for c in [(727, 666), (995, 685)]:
    eyes |= bl == bl[c[1], c[0]] if bl[c[1], c[0]] else False
assert eyes.sum() < 40000, eyes.sum()
eye_ring = ndi.binary_dilation(eyes, iterations=3) & (lab == 1)

base = lab.copy(); base[ant_rm | hand_rm] = 255; base[eyes | ndi.binary_dilation(eyes, iterations=2) & (lab != 1) & ~eyes & False] = 1
base[eyes] = 1
ant = np.where(ant_reg, lab, 255).astype(np.uint8)
hand = np.where(hand_reg, lab, 255).astype(np.uint8)
eye = np.where(eyes, 0, 255).astype(np.uint8)

def trace(lb, colors):
    rgba = np.zeros(lb.shape + (4,), np.uint8)
    for k, c in colors.items():
        r, g, b = (int(c[i:i + 2], 16) for i in (1, 3, 5)); rgba[lb == k] = (r, g, b, 255)
    ys, xs = np.where(rgba[..., 3] > 0); x0, y0, x1, y1 = xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5
    crop = rgba[y0:y1, x0:x1]
    Image.fromarray(crop).save(f"{W}/l/t.png")
    vtracer.convert_image_to_svg_py(f"{W}/l/t.png", f"{W}/l/t.svg", colormode="color", hierarchical="stacked", mode="spline",
        filter_speckle=10, color_precision=8, layer_difference=8, corner_threshold=70, length_threshold=4.0,
        max_iterations=10, splice_threshold=45, path_precision=2)
    s = open(f"{W}/l/t.svg").read()
    out = []
    pal = {k: tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)) for k, c in colors.items()}
    for d, fill, tr in re.findall(r'<path d="([^"]+)" fill="(#[0-9A-Fa-f]{6})" transform="translate\(([^)]+)\)"', s):
        rgb = tuple(int(fill[i:i + 2], 16) for i in (1, 3, 5))
        k = min(pal, key=lambda q: sum((a - b) ** 2 for a, b in zip(pal[q], rgb)))
        tx, ty = (float(v) for v in tr.split(","))
        out.append(f'<path d="{d}" fill="{colors[k]}" transform="translate({tx + x0:g},{ty + y0:g})"/>')
    return "".join(out)

def back(mask, kind):
    m = mask.astype(np.uint8)
    white = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (69, 69)))
    hair = cv2.dilate(white, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    if kind == "shadow":
        sh = np.zeros_like(hair); sh[16:, 14:] = hair[:-16, :-14]
        return trace(np.where(sh > 0, 0, 255).astype(np.uint8), {0: SHADOW})
    if kind == "hair":
        return trace(np.where(hair > 0, 0, 255).astype(np.uint8), {0: HAIR})
    return trace(np.where(white > 0, 0, 255).astype(np.uint8), {0: WHITE})

base_sil = base != 255
parts = {"base": base_sil, "ant": ant_reg, "hand": hand_reg}
P = {"ant": (938, 284), "hand": P_HAND}
print("hand pivot", P_HAND)
def g(name, body):
    if name in P: return f'<g class="{name}" style="transform-origin:{P[name][0]}px {P[name][1]}px">{body}</g>'
    return f"<g>{body}</g>"

svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 {W_ + 140} {H_ + 140}">',
       "<style>.ant,.hand,.eye{transform-box:view-box}"
       ".hand{animation:wave 4.2s ease-in-out infinite}.ant{animation:wob 2.6s ease-in-out infinite}"
       ".eye{transform-origin:0 0;animation:blink 4.6s infinite}"
       "@keyframes wave{0%,55%,100%{transform:rotate(0)}10%,30%{transform:rotate(-8deg)}20%,40%,50%{transform:rotate(6deg)}}"
       "@keyframes wob{0%,100%{transform:rotate(0)}25%{transform:rotate(5deg)}75%{transform:rotate(-5deg)}}"
       "@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.08)}}"
       "@media (prefers-reduced-motion:reduce){.ant,.hand,.eye{animation:none}}</style>"]
for kind in ("shadow", "hair", "white"):
    for n in ("base", "ant", "hand"):
        svg.append(g(n, back(parts[n], kind)))
svg.append(g("base", trace(base, COL)))
svg.append(g("ant", trace(ant, COL)))
svg.append(g("hand", trace(hand, COL)))
for (cx, cy) in [(727, 666), (995, 685)]:
    one = eyes & (bl == bl[cy, cx])
    ys, xs = np.where(one); ecx, ecy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    body = trace(np.where(one, 0, 255).astype(np.uint8), {0: COL[0]})
    svg.append(f'<g class="eye" style="transform-origin:{ecx:g}px {ecy:g}px">{body}</g>')
svg.append("</svg>")
open(f"{W}/mascot.svg", "w").write("".join(svg))
print("bytes", len("".join(svg)))
