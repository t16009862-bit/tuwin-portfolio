from pathlib import Path

from PIL import Image
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "tuwin_portfolio.pdf"
TMP = ROOT / "tmp" / "pdfs"
TMP.mkdir(parents=True, exist_ok=True)

W, H = A4
BG = HexColor("#06070A")
PANEL = HexColor("#0D1218")
CYAN = HexColor("#0DF4FF")
OFF = HexColor("#F4F1E8")
MUTED = HexColor("#A7B1BD")
LINE = HexColor("#26313D")

pdfmetrics.registerFont(TTFont("THSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("THSans-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))


def crop_image(source: Path, target: Path, ratio: float, anchor_y: float = 0.5):
    im = Image.open(source).convert("RGB")
    src_ratio = im.width / im.height
    if src_ratio > ratio:
        new_w = int(im.height * ratio)
        left = (im.width - new_w) // 2
        box = (left, 0, left + new_w, im.height)
    else:
        new_h = int(im.width / ratio)
        top = max(0, min(im.height - new_h, int((im.height - new_h) * anchor_y)))
        box = (0, top, im.width, top + new_h)
    im.crop(box).save(target, quality=94)


cover_crop = TMP / "cover.jpg"
portrait_crop = TMP / "portrait.jpg"
saurav_crop = TMP / "saurav.jpg"
crop_image(ROOT / "public" / "tuwin-profile-2026.jpg", cover_crop, W / H, 0.38)
crop_image(ROOT / "public" / "tuwin-cover-square.jpg", portrait_crop, 0.84, 0.28)
crop_image(ROOT / "public" / "testimonials" / "saurav-ghosal.jpg", saurav_crop, 0.84, 0.35)


def add_page_base(c, page_no, section):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setStrokeColor(Color(0.05, 0.96, 1, alpha=0.6))
    c.setLineWidth(0.8)
    c.line(34, H - 34, W - 34, H - 34)
    c.setFont("THSans-Bold", 7)
    c.setFillColor(CYAN)
    c.drawString(34, H - 25, "TUWIN HERATH / OFFICIAL MEDIA KIT")
    c.setFillColor(MUTED)
    c.drawRightString(W - 34, H - 25, section.upper())
    c.setFont("THSans", 7)
    c.drawString(34, 20, "tuwinh.com")
    c.drawRightString(W - 34, 20, f"0{page_no}")


def text(c, value, x, y, size, color=OFF, font="THSans", tracking=0):
    c.setFont(font, size)
    c.setFillColor(color)
    if tracking:
        cursor = x
        for ch in value:
            c.drawString(cursor, y, ch)
            cursor += stringWidth(ch, font, size) + tracking
    else:
        c.drawString(x, y, value)


def wrapped(c, value, x, y, width, size=10, leading=15, color=MUTED, bold=False):
    style = ParagraphStyle(
        "body",
        fontName="THSans-Bold" if bold else "THSans",
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=TA_LEFT,
        spaceAfter=0,
    )
    p = Paragraph(value, style)
    _, h = p.wrap(width, 300)
    p.drawOn(c, x, y - h)
    return y - h


def pill(c, value, x, y, width=None):
    c.setFont("THSans-Bold", 7)
    measured = stringWidth(value.upper(), "THSans-Bold", 7) + 18
    w = width or measured
    c.setFillColor(Color(0.05, 0.96, 1, alpha=0.08))
    c.setStrokeColor(Color(0.05, 0.96, 1, alpha=0.45))
    c.roundRect(x, y - 14, w, 18, 9, fill=1, stroke=1)
    c.setFillColor(CYAN)
    c.drawCentredString(x + w / 2, y - 8.5, value.upper())
    return w


def stat(c, label, value, x, y, width):
    c.setFillColor(PANEL)
    c.setStrokeColor(LINE)
    c.roundRect(x, y - 70, width, 70, 8, fill=1, stroke=1)
    text(c, value, x + 14, y - 31, 22, OFF, "THSans-Bold")
    text(c, label.upper(), x + 14, y - 51, 6.5, CYAN, "THSans-Bold", 0.5)


c = canvas.Canvas(str(OUT), pagesize=A4)
c.setTitle("Tuwin Herath - Official Media Kit")
c.setAuthor("Team TH")
c.setSubject("Professional squash athlete profile, career highlights and media contact")

# Cover
c.drawImage(ImageReader(str(cover_crop)), 0, 0, W, H, mask="auto")
c.setFillColor(Color(0.02, 0.025, 0.035, alpha=0.38))
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(Color(0.02, 0.025, 0.035, alpha=0.88))
c.rect(0, 0, W, 285, fill=1, stroke=0)
c.setStrokeColor(CYAN)
c.setLineWidth(1.3)
c.line(36, 264, 124, 264)
text(c, "SRI LANKA / PSA SQUASH TOUR", 36, 244, 7, CYAN, "THSans-Bold", 1.2)
text(c, "TUWIN", 34, 183, 49, OFF, "THSans-Bold")
text(c, "HERATH", 34, 133, 49, OFF, "THSans-Bold")
text(c, "PROFESSIONAL SQUASH ATHLETE", 37, 105, 10, OFF, "THSans-Bold", 1.1)
text(c, "OFFICIAL MEDIA KIT / 2026", 37, 82, 8, MUTED, "THSans-Bold", 0.8)
pill(c, "Career high WR 316", 37, 57)
pill(c, "Current WR 484", 165, 57)
text(c, "tuwinh.com", W - 115, 42, 8, OFF, "THSans-Bold")
c.showPage()

# Athlete profile
add_page_base(c, 2, "Athlete profile")
text(c, "THE ATHLETE", 34, H - 92, 28, OFF, "THSans-Bold")
text(c, "International competitor. Sri Lankan representative. PSA professional.", 35, H - 113, 8, CYAN, "THSans-Bold")

c.setFillColor(PANEL)
c.setStrokeColor(LINE)
c.roundRect(34, H - 494, 205, 345, 12, fill=1, stroke=1)
c.saveState()
path = c.beginPath()
path.roundRect(48, H - 421, 177, 238, 8)
c.clipPath(path, stroke=0, fill=0)
c.drawImage(ImageReader(str(portrait_crop)), 48, H - 421, 177, 238, preserveAspectRatio=True, anchor="c")
c.restoreState()
text(c, "TUWIN OSANDA HERATH", 48, H - 446, 12, OFF, "THSans-Bold")
text(c, "Sri Lanka / Right-handed", 48, H - 465, 8, MUTED)

right_x = 264
wrapped(
    c,
    "Tuwin Herath represents Sri Lanka on the PSA Squash Tour. Since joining the professional circuit in 2023, he has competed across Asia, Europe and Oceania while building a career grounded in disciplined preparation, international exposure and national representation.",
    right_x,
    H - 154,
    296,
    size=10.2,
    leading=15.5,
    color=OFF,
)

stat(c, "PSA world ranking", "#484", right_x, H - 270, 138)
stat(c, "Career-high rank", "#316", right_x + 150, H - 270, 138)
stat(c, "PSA points", "102", right_x, H - 352, 138)
stat(c, "Tour events counted", "8", right_x + 150, H - 352, 138)

text(c, "ATHLETE DETAILS", right_x, H - 453, 7, CYAN, "THSans-Bold", 1.0)
details = [
    ("Born", "19 March 2000"),
    ("Height / Weight", "171 cm / 61 kg"),
    ("PSA member since", "2023"),
    ("Coach", "Ritwik Bhattacharya"),
    ("Languages", "English / Sinhala"),
]
yy = H - 478
for label, value in details:
    text(c, label.upper(), right_x, yy, 6.3, MUTED, "THSans-Bold", 0.5)
    text(c, value, right_x + 118, yy, 8.7, OFF, "THSans-Bold")
    c.setStrokeColor(LINE)
    c.line(right_x, yy - 9, W - 34, yy - 9)
    yy -= 32

c.setFillColor(Color(0.05, 0.96, 1, alpha=0.06))
c.setStrokeColor(Color(0.05, 0.96, 1, alpha=0.35))
c.roundRect(34, 53, W - 68, 104, 10, fill=1, stroke=1)
text(c, "CURRENT DIRECTION", 52, 129, 7, CYAN, "THSans-Bold", 1.0)
wrapped(c, "Building toward the world top 200 through a consistent PSA schedule, high-performance coaching and international match exposure.", 52, 112, W - 104, size=12, leading=17, color=OFF, bold=True)
text(c, "Ranking data: official PSA publication, 16 November 2026.", 52, 70, 7, MUTED)
c.showPage()

# Career evidence
add_page_base(c, 3, "Career evidence")
text(c, "CAREER EVIDENCE", 34, H - 92, 28, OFF, "THSans-Bold")
text(c, "Selected milestones and verified competition results", 35, H - 113, 8, CYAN, "THSans-Bold")

milestones = [
    ("2026", "PSA CHALLENGER CAMPAIGN", "Four international Challenger appearances across Japan, Bangladesh, Hong Kong and India."),
    ("2025", "INTERNATIONAL PODIUM", "Third place at QSF 3 PSA Satellite in Doha, Qatar; career-high world ranking of 316."),
    ("2024", "CHALLENGER QUARTER-FINALS", "Top-five finishes at Bondi Open, Reliance PSA Challenger and Pune LTD Open."),
    ("2023", "SRI LANKA SENIOR REPRESENTATIVE", "Represented Sri Lanka at the Asian Individual Squash Championships in Hong Kong and joined the PSA Tour."),
    ("2018", "JUNIOR NATIONAL LEADERSHIP", "Sri Lanka Junior National Vice Captain after seven consecutive years of junior national representation."),
]

yy = H - 157
for year, title_, desc in milestones:
    c.setFillColor(CYAN)
    c.circle(49, yy - 6, 4, fill=1, stroke=0)
    c.setStrokeColor(Color(0.05, 0.96, 1, alpha=0.35))
    c.setLineWidth(1)
    if year != milestones[-1][0]:
        c.line(49, yy - 13, 49, yy - 88)
    text(c, year, 67, yy, 8, CYAN, "THSans-Bold")
    text(c, title_, 119, yy, 10, OFF, "THSans-Bold")
    wrapped(c, desc, 119, yy - 12, 430, size=8.5, leading=12.5, color=MUTED)
    yy -= 93

c.setFillColor(PANEL)
c.setStrokeColor(LINE)
c.roundRect(34, 54, W - 68, 182, 12, fill=1, stroke=1)
c.saveState()
path = c.beginPath()
path.roundRect(48, 69, 106, 152, 8)
c.clipPath(path, stroke=0, fill=0)
c.drawImage(ImageReader(str(saurav_crop)), 48, 69, 106, 152, preserveAspectRatio=True, anchor="c")
c.restoreState()
text(c, "PLAYER ENDORSEMENT", 177, 209, 7, CYAN, "THSans-Bold", 1.0)
wrapped(
    c,
    '"It is my sincere wish that Tuwin excels in numerous tournaments within the professional arena, ultimately ascending to the pinnacle of the sport."',
    177,
    188,
    372,
    size=11,
    leading=16,
    color=OFF,
    bold=True,
)
text(c, "SAURAV GHOSAL", 177, 96, 9, OFF, "THSans-Bold")
text(c, "Former World No. 10 / India No. 1", 177, 80, 7.5, MUTED)
c.showPage()

# Partnership and contact
add_page_base(c, 4, "Partnerships and media")
text(c, "BUILT FOR PARTNERSHIP", 34, H - 92, 28, OFF, "THSans-Bold")
wrapped(
    c,
    "Tuwin offers partners an athlete platform spanning professional competition, international travel, coaching knowledge and a growing South Asian squash audience.",
    35,
    H - 119,
    W - 70,
    size=11,
    leading=16,
    color=MUTED,
)

text(c, "CURRENT COMMERCIAL PARTNERS", 35, H - 190, 7, CYAN, "THSans-Bold", 1.0)
partners = ["SCYLLA ZELUS", "FITSAIR", "UNIKEY GLOBAL", "WINGED FALCON"]
px = 35
py = H - 219
for idx, partner in enumerate(partners):
    box_w = 126
    c.setFillColor(PANEL)
    c.setStrokeColor(LINE)
    c.roundRect(px, py - 48, box_w, 48, 7, fill=1, stroke=1)
    text(c, partner, px + 12, py - 29, 7.2, OFF, "THSans-Bold")
    px += box_w + 10

text(c, "PARTNERSHIP VALUE", 35, H - 310, 7, CYAN, "THSans-Bold", 1.0)
items = [
    ("01", "INTERNATIONAL VISIBILITY", "PSA competition across Asia, Europe and Oceania."),
    ("02", "AUTHENTIC PERFORMANCE", "A professional athlete story built on measurable progress."),
    ("03", "SQUASH COMMUNITY", "Connection to players, coaches, clubs and the next generation."),
]
yy = H - 344
for no, title_, desc in items:
    c.setFillColor(Color(0.05, 0.96, 1, alpha=0.08))
    c.setStrokeColor(Color(0.05, 0.96, 1, alpha=0.3))
    c.roundRect(35, yy - 67, W - 70, 67, 8, fill=1, stroke=1)
    text(c, no, 50, yy - 36, 15, CYAN, "THSans-Bold")
    text(c, title_, 92, yy - 27, 9.2, OFF, "THSans-Bold")
    text(c, desc, 92, yy - 47, 8, MUTED)
    yy -= 79

c.setFillColor(OFF)
c.roundRect(35, 61, W - 70, 154, 12, fill=1, stroke=0)
text(c, "MEDIA / PARTNERSHIPS", 54, 183, 7, HexColor("#40505E"), "THSans-Bold", 1.0)
text(c, "LET'S BUILD THE NEXT CHAPTER.", 54, 150, 19, BG, "THSans-Bold")
text(c, "Email", 54, 118, 7, HexColor("#40505E"), "THSans-Bold")
text(c, "tuwinosanda@gmail.com", 54, 100, 9, BG, "THSans-Bold")
text(c, "WhatsApp", 286, 118, 7, HexColor("#40505E"), "THSans-Bold")
text(c, "+94 78 416 2429", 286, 100, 9, BG, "THSans-Bold")
text(c, "Website", 443, 118, 7, HexColor("#40505E"), "THSans-Bold")
text(c, "tuwinh.com", 443, 100, 9, BG, "THSans-Bold")
text(c, "TEAM TH - DIGITAL MANAGEMENT", 54, 78, 7, BG, "THSans-Bold", 0.6)

c.save()
print(OUT)
