from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas

W, H = letter  # 612 x 792
GOLD = HexColor('#C9A227')
INK = HexColor('#141414')
GRAY = HexColor('#777777')
FIELD_BG = HexColor('#F4F2EC')
FIELD_BORDER = HexColor('#CFC8B8')

ASSETS = '/private/tmp/claude-501/-Users-joefaenza/20dbf58e-ada0-4bdc-bdcd-88c8f02b05c4/scratchpad/'
MONO_W = ASSETS + 'be_monogram_white.png'   # 1307x1064
MONO_WM = ASSETS + 'be_monogram_watermark.png'
BELLO_W = ASSETS + 'bello_word_white.png'   # 1568x266
ENT_G = ASSETS + 'entertain_white.png'       # 1637x89

OUT = '/Users/joefaenza/Downloads/Bello-Party-Planning-Form.pdf'
c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle('Bello Entertainment — Party Planning Form')
form = c.acroForm

M = 40  # side margin


def tf(name, x, y, w, h=16, tooltip='', font=10, multiline=False):
    form.textfield(name=name, x=x, y=y, width=w, height=h,
                   borderWidth=0.75, borderColor=FIELD_BORDER, fillColor=FIELD_BG,
                   textColor=INK, fontSize=font, tooltip=tooltip,
                   fieldFlags='multiline' if multiline else '')


def cb(name, x, y, size=11):
    form.checkbox(name=name, x=x, y=y, size=size, buttonStyle='cross',
                  borderWidth=1, borderColor=GRAY, fillColor=white, textColor=INK)


def label(x, y, text, size=8, color=GRAY, font='Helvetica', align='left'):
    c.setFont(font, size)
    c.setFillColor(color)
    if align == 'right':
        c.drawRightString(x, y, text)
    else:
        c.drawString(x, y, text)


def spaced_text(x, y, text, font, size, color, charspace, align='left'):
    w = c.stringWidth(text, font, size) + charspace * (len(text) - 1)
    if align == 'right':
        x -= w
    elif align == 'center':
        x -= w / 2
    to = c.beginText(x, y)
    to.setFont(font, size)
    to.setFillColor(color)
    to.setCharSpace(charspace)
    to.textOut(text)
    to.setCharSpace(0)  # Tc persists in graphics state; reset so labels aren't stretched
    c.drawText(to)
    return w


def section(y, title):
    c.setFillColor(INK)
    c.rect(M, y - 2, 3, 12, fill=1, stroke=0)
    t = title.upper()
    tw = spaced_text(M + 9, y, t, 'Times-Bold', 12, INK, 1.4)
    c.setStrokeColor(FIELD_BORDER)
    c.setLineWidth(0.75)
    c.line(M + 9 + tw + 8, y + 3, W - M, y + 3)


def header(page2=False):
    band = 88 if page2 else 104
    c.setFillColor(INK)
    c.rect(0, H - band, W, band, fill=1, stroke=0)
    # BE monogram
    mh = 62 if page2 else 82
    mw = mh * 1307 / 1064
    my = H - band + (band - mh) / 2
    c.drawImage(MONO_W, M, my, width=mw, height=mh, mask='auto')
    # BELLO / ENTERTAINMENT lockup
    lx = M + mw + 16
    bh = 15 if page2 else 19
    bw = bh * 1568 / 266
    eh = bh * 0.40
    ew = eh * 1637 / 89
    ctr = lx + max(bw, ew) / 2
    byy = H - band / 2 + (1 if page2 else 2)
    c.drawImage(BELLO_W, ctr - bw / 2, byy, width=bw, height=bh, mask='auto')
    c.drawImage(ENT_G, ctr - ew / 2, byy - eh - 5, width=ew, height=eh, mask='auto')
    # right block
    ty = H - band / 2 + (2 if page2 else 4)
    sub = 'PAGE 2  ·  THE MUSIC' if page2 else 'PARTY PLANNING FORM'
    spaced_text(W - M, ty, sub, 'Times-Bold', 13, white, 2.2, align='right')
    label(W - M, ty - 14, 'BELLOENTERTAINMENTNJ.COM', 8, white, 'Helvetica', align='right')
    label(W - M, ty - 25, 'inquire@belloentertainmentnj.com', 8, HexColor('#BBBBBB'), 'Helvetica', align='right')


def watermark():
    ww = 330
    wh = ww * 1064 / 1307
    c.drawImage(MONO_WM, (W - ww) / 2, (H - wh) / 2 - 30, width=ww, height=wh, mask='auto')


def footer(text):
    c.setFillColor(GRAY)
    c.setFont('Times-Italic', 8.5)
    c.drawCentredString(W / 2, 26, text)
    c.setFillColor(INK)
    c.rect(0, 0, W, 6, fill=1, stroke=0)


# ============================= PAGE 1 =============================
header()
watermark()
y = H - 136

# --- Event details ---
section(y, 'The Event')
y -= 30
label(M, y + 18, 'YOUR NAME')
tf('client_name', M, y, 180)
label(M + 192, y + 18, 'PHONE')
tf('client_phone', M + 192, y, 130)
label(M + 334, y + 18, 'EMAIL')
tf('client_email', M + 334, y, W - M - (M + 334))
y -= 34
label(M, y + 18, 'TYPE OF PARTY (wedding, sweet 16, birthday...)')
tf('event_type', M, y, 220)
label(M + 232, y + 18, 'DATE')
tf('event_date', M + 232, y, 100)
label(M + 344, y + 18, 'START TIME')
tf('start_time', M + 344, y, 80)
label(M + 436, y + 18, 'END TIME')
tf('end_time', M + 436, y, 80)

# --- Venue ---
y -= 42
section(y, 'The Venue')
y -= 30
label(M, y + 18, 'HALL / VENUE NAME')
tf('venue_name', M, y, 220)
label(M + 232, y + 18, 'ADDRESS')
tf('venue_address', M + 232, y, W - M - (M + 232))
y -= 34
label(M, y + 18, 'EXPECTED GUESTS')
tf('guest_count', M, y, 90)
label(M + 102, y + 18, 'OTHER VENDORS NEEDING AUDIO IN/OUT (photo booth, videographer, ceremony mic, slideshow...)')
tf('vendors_audio', M + 102, y, W - M - (M + 102))

# --- Guests of honor ---
y -= 42
section(y, 'Guests of Honor & Walk-Out Songs')
y -= 14
label(M, y, 'WHO ARE WE CELEBRATING?', 7.5)
label(M + 262, y, 'WALK-OUT / INTRO SONG', 7.5)
y -= 18
for i in range(1, 4):
    label(M - 2, y + 4, f'{i}.', 9, INK, 'Helvetica-Bold')
    tf(f'honoree_{i}', M + 12, y, 238)
    tf(f'walkout_{i}', M + 262, y, W - M - (M + 262))
    y -= 22

# --- Key moments ---
y -= 12
section(y, 'Key Moments & Announcements')
y -= 8
label(M, y, 'First dance, parent dances, cake, toasts, surprises — anything we should MC or cue up', 7.5)
y -= 40
tf('key_moments', M, y, W - 2 * M, 36, multiline=True)

# --- Genres ---
y -= 22
section(y, 'The Vibe — What Should We Play?')
y -= 8
label(M, y, 'Mark each style:  LOVE = pillar of the night    MIX = sprinkle it in    SKIP = not for this crowd', 7.5)

genres = ['70s Classics', '80s Hits', '90s Hip Hop', '90s Dance', '2000s Hip Hop',
          '2000s Pop', 'Euro Dance', 'Disco', 'Motown / Oldies', 'Latin',
          'House / EDM', "R&B / Slow Jams", 'Rock', 'Country', "Today's Hits", 'Freestyle']

col_x = [M, M + 270]
row_h = 17
grid_top = y - 16
for cx in col_x:
    for j, t in enumerate(['LOVE', 'MIX', 'SKIP']):
        label(cx + 148 + j * 34 + 5, grid_top + 4, t, 6.5, GRAY)
yy0 = grid_top - 12
for idx, gname in enumerate(genres):
    col = idx // 8
    row = idx % 8
    gx = col_x[col]
    gy = yy0 - row * row_h
    if row % 2 == 0:
        c.setFillColor(HexColor('#F7F5F0'))
        c.rect(gx - 4, gy - 4, 258, row_h - 2, fill=1, stroke=0)
    label(gx, gy, gname, 9, INK)
    key = gname.lower().replace(' ', '_').replace('/', '').replace("'", '').replace('__', '_')
    for j, t in enumerate(['love', 'mix', 'skip']):
        cb(f'g_{key}_{t}', gx + 148 + j * 34, gy - 3, 10)

y = yy0 - 8 * row_h - 4
label(M, y + 4, 'OTHER STYLES WE MISSED')
tf('genres_other', M + 118, y, W - M - (M + 118), 15)

footer('Bello Entertainment  ·  Premium DJ — Weddings · Corporate · Private Events  ·  belloentertainmentnj.com')
c.showPage()

# ============================= PAGE 2 =============================
header(page2=True)
watermark()
y = H - 118

section(y, 'Top 20 Must-Play  (song — artist)')
y -= 22
col_w = (W - 2 * M - 20) / 2
top = y
for i in range(20):
    col = i // 10
    row = i % 10
    x = M + col * (col_w + 20)
    yy = top - row * 24
    label(x, yy + 4, f'{i + 1}.', 9, INK, 'Helvetica-Bold')
    tf(f'play_{i + 1}', x + 18, yy, col_w - 18)
y = top - 10 * 24 - 6

section(y, 'Top 20 Do-Not-Play  (even if requested)')
y -= 22
top = y
for i in range(20):
    col = i // 10
    row = i % 10
    x = M + col * (col_w + 20)
    yy = top - row * 24
    label(x, yy + 4, f'{i + 1}.', 9, INK, 'Helvetica-Bold')
    tf(f'noplay_{i + 1}', x + 18, yy, col_w - 18)
y = top - 10 * 24 - 10

section(y, 'Requests Policy & Final Notes')
y -= 22
cb('req_take_requests', M, y - 2)
label(M + 16, y, 'Take guest requests', 9, INK)
cb('req_check_first', M + 130, y - 2)
label(M + 146, y, 'Check with us first', 9, INK)
cb('req_playlist_only', M + 258, y - 2)
label(M + 274, y, 'Stick to our lists', 9, INK)
label(M + 370, y + 12, 'VOLUME VIBE (dinner→party?)', 7)
tf('volume_vibe', M + 370, y - 4, W - M - (M + 370), 15)
y -= 44
label(M, y + 14, 'ANYTHING ELSE THAT MAKES THIS PARTY PERFECT?')
tf('final_notes', M, y - 24, W - 2 * M, 36, multiline=True)

footer('Thank you! Email this completed form to inquire@belloentertainmentnj.com  ·  We build the night around it.')
c.showPage()
c.save()
print('saved', OUT)
