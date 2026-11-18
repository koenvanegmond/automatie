import re, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

REPO = "/home/claude/automatie"
INK, MINT, YEL, LIL, DK, LB = "#0E1110", "#9FE0B8", "#F7D95C", "#DCCBF7", "#25855A", "#DCEFE5"

def wordmark(text, size, track=1.0):
    f = TTFont(f"{REPO}/src/fonts/Anton-Regular.woff2"); gs = f.getGlyphSet(); cmap = f.getBestCmap()
    upm = f['head'].unitsPerEm; hm = f['hmtx']; s = size/upm; x = 0; pen = SVGPathPen(gs)
    for ch in text:
        g = cmap[ord(ch)]
        gs[g].draw(TransformPen(pen, (s,0,0,-s,x,0)))
        x += hm[g][0]*s + track
    return pen.getCommands(), x-track, f['OS/2'].sCapHeight*s

def head(face_extra=True, arcs=False, cls=""):
    SIDE="#7FB69A"
    return f'''<g stroke-linejoin="round" stroke-linecap="round">
<rect x="18" y="42" width="120" height="108" rx="26" fill="{SIDE}" stroke="{INK}" stroke-width="4"/>
<path d="M68 40 Q66 26 78 20" fill="none" stroke="{INK}" stroke-width="4"/>
<circle cx="81" cy="15" r="8.5" fill="{YEL}" stroke="{INK}" stroke-width="4"/>
<rect x="6" y="48" width="120" height="108" rx="26" fill="{MINT}" stroke="{INK}" stroke-width="4"/>
<path d="M51.1 153.9 L64 182 L83.4 153.9 Z" fill="{MINT}" stroke="none"/>
<path d="M52 156 L64 182 L82 156" fill="none" stroke="{INK}" stroke-width="4"/>
<path d="M50 49 Q50 36 66 36 Q82 36 82 49 Z" fill="{YEL}" stroke="{INK}" stroke-width="4"/>
<g class="{cls}"><circle cx="44" cy="92" r="6" fill="{INK}"/><circle cx="88" cy="92" r="6" fill="{INK}"/></g>
<path d="M42 110 Q66 138 90 110 Z" fill="{INK}" stroke="{INK}" stroke-width="3"/>
</g>'''

def sparkle(cx, cy, r, fill="#fff"):
    k = r*0.28
    return f'<path d="M{cx} {cy-r} Q{cx+k} {cy-k} {cx+r} {cy} Q{cx+k} {cy+k} {cx} {cy+r} Q{cx-k} {cy+k} {cx-r} {cy} Q{cx-k} {cy-k} {cx} {cy-r} Z" fill="{fill}" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>'

def limb(d, w=22):
    return f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{w+8}" stroke-linecap="round"/><path d="{d}" fill="none" stroke="{MINT}" stroke-width="{w}" stroke-linecap="round"/>'

def bubble(x, y, w=44, h=32, dots=True):
    DOTS = f'<circle cx="{x+w*0.3}" cy="{y+h/2}" r="2.6" fill="{INK}"/><circle cx="{x+w*0.5}" cy="{y+h/2}" r="2.6" fill="{INK}"/><circle cx="{x+w*0.7}" cy="{y+h/2}" r="2.6" fill="{INK}"/>' if dots else ''
    return f'''<g><path d="M{x+8} {y+h-2} L{x+4} {y+h+10} L{x+20} {y+h-2} Z" fill="{MINT}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>
<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{MINT}" stroke="{INK}" stroke-width="3"/>
<rect x="{x+6}" y="{y+h-6}" width="14" height="8" fill="{MINT}"/>
{DOTS}</g>'''

def mascot():
    legs = f'''<rect x="168" y="330" width="30" height="62" rx="13" fill="{MINT}" stroke="{INK}" stroke-width="4"/>
<rect x="206" y="330" width="30" height="62" rx="13" fill="{MINT}" stroke="{INK}" stroke-width="4"/>
<rect x="158" y="378" width="46" height="24" rx="12" fill="{LIL}" stroke="{INK}" stroke-width="4"/>
<rect x="200" y="378" width="46" height="24" rx="12" fill="{LIL}" stroke="{INK}" stroke-width="4"/>'''
    body = f'<rect x="150" y="196" width="104" height="150" rx="48" fill="{MINT}" stroke="{INK}" stroke-width="4"/>'
    pads = f'<circle cx="152" cy="236" r="15" fill="{LIL}" stroke="{INK}" stroke-width="4"/><circle cx="252" cy="236" r="15" fill="{LIL}" stroke="{INK}" stroke-width="4"/>'
    fingers = "".join(f'<rect x="{x-5}" y="150" width="10" height="26" rx="5" transform="rotate({r} {x} 176)" fill="{MINT}" stroke="{INK}" stroke-width="3.5"/>' for x, r in ((66,-18),(80,-4),(94,12)))
    wave = f'<g class="m-wave">{limb("M152 238 Q96 244 82 192", 22)}{fingers}<circle cx="82" cy="184" r="19" fill="{MINT}" stroke="{INK}" stroke-width="4"/></g>'
    phone = f'''<g class="m-phone">{limb("M252 238 Q292 244 296 286", 22)}
<rect x="288" y="196" width="68" height="118" rx="13" fill="#fff" stroke="{INK}" stroke-width="5"/>
<rect x="296" y="205" width="52" height="100" rx="8" fill="{LB}"/>
{bubble(300, 232, 40, 30, False)}
<path d="M311 247 l6 6 l12 -12" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="283" y="272" width="22" height="30" rx="11" fill="{MINT}" stroke="{INK}" stroke-width="4"/>
<rect x="344" y="250" width="14" height="30" rx="7" fill="{MINT}" stroke="{INK}" stroke-width="4"/></g>'''
    deco = sparkle(330, 150, 17)+sparkle(358, 176, 9)+sparkle(112, 330, 11)+sparkle(138, 362, 16)+bubble(48, 92, 44, 32)+bubble(290, 352, 40, 28)
    hd = f'<g transform="translate(116 8) scale(1.12)">{head(True, True, "m-blink")}</g>'
    return f'{legs}{body}{pads}{wave}{phone}{hd}{deco}'

def jsx(s):
    s = s.replace("class=", "className=")
    for k in ("stroke-width","stroke-linecap","stroke-linejoin"):
        s = s.replace(k+"=", re.sub(r"-(\w)", lambda m: m.group(1).upper(), k)+"=")
    return s

def write(p, s): open(f"{REPO}/{p}", "w").write(s)

W = lambda body, vb: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="none">{body}</svg>\n'
hd = head(True, False)
write("public/logo-mark.svg", W(hd, "0 0 142 190"))
d, w, cap = wordmark("APPMAATJE", 100, 1.2)
base = 140
def halo(h):
    # witte stickerrand achter de robot, zodat de zwarte lijnen op donker zichtbaar blijven
    import re as _re
    b = _re.sub(r'stroke-width="[0-9.]+"', 'stroke-width="12"', h)
    b = _re.sub(r'(fill|stroke)="#[0-9A-Fa-f]{6}"', r'\1="#FFFFFF"', b)
    return b.replace('<g class="">', '<g>') + h
def lockup(txt):
    return W(f'{halo(hd) if txt != INK else hd}<path transform="translate(162 {base})" d="{d}" fill="{txt}"/>', f"0 0 {162+w:.1f} 190")
write("public/logo.svg", lockup(INK)); write("public/logo-light.svg", lockup("#FFFFFF"))
# gestapeld: robot boven, naam eronder
def stacked(txt):
    tw = 300.0; sz = 100 * tw / w
    d2, w2, cap2 = wordmark("APPMAATJE", sz, 1.2 * sz / 100)
    W_ = max(w2, 142) + 20; hx = (W_ - 142) / 2; tx = (W_ - w2) / 2; ty = 190 + 30 + cap2
    return W(f'<g transform="translate({hx:.1f} 0)">{halo(hd) if txt != INK else hd}</g><path transform="translate({tx:.1f} {ty:.1f})" d="{d2}" fill="{txt}"/>', f"0 0 {W_:.1f} {ty + 6:.1f}")
write("public/logo-stacked.svg", stacked(INK)); write("public/logo-stacked-light.svg", stacked("#FFFFFF"))
# favicon
fav = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="{MINT}"/><circle cx="16" cy="6.2" r="3" fill="{YEL}" stroke="{INK}" stroke-width="1.6"/><circle cx="10.5" cy="15" r="2.3" fill="{INK}"/><circle cx="21.5" cy="15" r="2.3" fill="{INK}"/><path d="M9.5 21 Q16 28 22.5 21 Z" fill="{INK}" stroke="{INK}" stroke-width="1.5" stroke-linejoin="round"/></svg>\n'
write("src/app/icon.svg", fav)
# React: mascot (animatable, inline) and head
h = jsx(head(True, False))
write("src/components/LogoMark.tsx", f'''// Gegenereerd door tools/build_brand.py.
export const LogoMark = ({{ className = "" }}: {{ className?: string }}) => (
  <svg viewBox="0 0 142 190" fill="none" aria-hidden="true" className={{className}}>
    {h}
  </svg>
);
''')
# wordmark as component too (outlined, exact Anton shape)
write("src/components/Wordmark.tsx", f'''// Gegenereerd door tools/build_brand.py: APPMAATJE in Anton als outlines.
export const Wordmark = ({{ className = "" }}: {{ className?: string }}) => (
  <svg viewBox="0 0 {w:.1f} {cap:.1f}" fill="currentColor" aria-hidden="true" className={{className}}>
    <path transform="translate(0 {cap:.1f})" d="{d}" />
  </svg>
);
''')
print("ok", round(w,1), round(cap,1))
