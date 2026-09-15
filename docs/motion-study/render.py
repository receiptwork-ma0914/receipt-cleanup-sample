"""Original silent motion study. All geography and journey times are fictional.
Run with Python 3.12, Pillow and FFmpeg/libx264. No network or client data.
"""
from pathlib import Path
import math, random, shutil, subprocess
from PIL import Image, ImageDraw, ImageFont

HERE=Path(__file__).resolve().parent
W,H,FPS,SECONDS=1080,1920,30,18
BG='#101316'; WHITE='#F5F0E5'; MUTED='#ADB4B8'; YELLOW='#FFD16B'; RED='#FA725C'
FONT=Path('/System/Library/Fonts/Supplemental')
fonts={}
def f(s,b=True):
    key=(s,b)
    if key not in fonts: fonts[key]=ImageFont.truetype(str(FONT/('Arial Bold.ttf' if b else 'Arial.ttf')),s)
    return fonts[key]
def text(d,xy,t,s=40,c=WHITE,b=True): d.text(xy,t,font=f(s,b),fill=c,anchor='lt')
def ease(v): return 1-(1-max(0,min(1,v)))**3
def trace(d,pts,p,c,width=12):
    lengths=[math.dist(a,b) for a,b in zip(pts,pts[1:])]
    remain=sum(lengths)*max(0,min(1,p)); last=pts[0]
    for a,b,L in zip(pts,pts[1:],lengths):
        if remain<=0: break
        q=min(1,remain/L); last=(a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q)
        d.line([a,last],fill=c,width=width); remain-=L
    d.ellipse((last[0]-13,last[1]-13,last[0]+13,last[1]+13),fill=WHITE)

MAP=Image.new('RGB',(W,H),BG); md=ImageDraw.Draw(MAP)
r=random.Random(53)
for x in range(78,1040,100):
    for y in range(650,1400,92):
        if 443<x<670: continue
        md.rounded_rectangle((x,y,x+r.randint(42,73),y+r.randint(44,65)),6,fill='#21282E')
for x in range(64,1040,100): md.line((x,620,x,1440),fill='#343B40',width=3)
for y in range(634,1440,92): md.line((54,y,1026,y),fill='#343B40',width=3)
md.polygon([(467,600),(627,600),(644,760),(594,935),(659,1140),(625,1440),(455,1440),(492,1120),(437,950),(482,758)],fill='#152F3A')
md.line([(550,616),(570,760),(517,944),(576,1130),(547,1420)],fill='#345668',width=3)
md.line((444,700,644,700),fill='#717779',width=22)
md.line((435,1260,640,1260),fill='#717779',width=22)
A=(212,1094); B=(870,1038)
LONG=[A,(264,1094),(264,726),(464,726),(636,726),(864,726),B]
SHORT=[A,(264,1094),(264,1002),(461,1002),(638,1002),(864,1002),B]

def frame(t):
    im=MAP.copy();d=ImageDraw.Draw(im)
    # Quiet frame and consistent disclosure; no logos or claimed client work.
    d.rectangle((0,0,W,592),fill=BG); d.rectangle((0,1460,W,H),fill=BG)
    text(d,(76,110),'MOTION STUDY  /  01',30,MUTED)
    d.line((76,171,1004,171),fill='#454C50',width=2)
    if t<5:
        off=int((1-ease(t/.75))*48)
        text(d,(72,234+off),'SAME CITY.',116)
        text(d,(72,377+off),'LONG WAY',108,YELLOW)
        text(d,(76,508),'AROUND.',59,YELLOW)
        trace(d,LONG,ease((t-.6)/3.2),YELLOW)
        label='ONE RIVER. TWO SIDES.'
        sub='Follow the existing crossing.'
    elif t<10:
        text(d,(72,234),'ONE NEW',116)
        text(d,(72,377),'CONNECTION.',104,RED)
        text(d,(76,518),'A different route appears.',43,MUTED,False)
        d.line(LONG,fill='#806D43',width=7)
        d.line((440,1002,654,1002),fill=RED,width=24)
        trace(d,SHORT,ease((t-5.3)/3.2),RED)
        label='CHANGE THE CONNECTION.'
        sub='Watch the journey change.'
    elif t<15:
        text(d,(72,234),'42',156,YELLOW)
        text(d,(294,301),'MIN',44,MUTED)
        text(d,(512,273),'→',94,WHITE)
        text(d,(694,234),'30',156,RED)
        text(d,(904,301),'MIN',44,MUTED)
        text(d,(76,449),'Same start. Same destination.',47)
        text(d,(76,528),'Illustrative journey times only.',32,MUTED,False)
        d.line(LONG,fill=YELLOW,width=8); d.line(SHORT,fill=RED,width=12)
        trace(d,SHORT,(t-10)%2.8/2.8,RED)
        label='SEE THE DIFFERENCE.'
        sub='The map makes the comparison visible.'
    else:
        text(d,(72,234),'A STORY.',120)
        text(d,(72,383),'IN MOTION.',111,YELLOW)
        text(d,(76,530),'Map animation + bold typography',42,MUTED,False)
        d.line(LONG,fill='#806D43',width=7);trace(d,SHORT,1,RED)
        label='ORIGINAL PORTFOLIO STUDY'
        sub='Created with code. Ready for a real brief.'
    for p,lab in [(A,'START'),(B,'ARRIVE')]:
        x,y=p;d.ellipse((x-21,y-21,x+21,y+21),fill=WHITE)
        d.ellipse((x-9,y-9,x+9,y+9),fill=BG)
        text(d,(x-54,y+38),lab,28)
    d.rounded_rectangle((73,1350,1007,1430),12,fill=BG)
    text(d,(95,1374),'FICTIONAL MAP  ·  NOT A REAL CITY',30,MUTED)
    text(d,(76,1510),label,43)
    text(d,(76,1590),sub,35,MUTED,False)
    d.rectangle((76,1712,1004,1718),fill='#41484D')
    d.rectangle((76,1712,76+int(928*t/SECONDS),1718),fill=YELLOW)
    text(d,(76,1770),'RECEIPT WORK  /  AI-ASSISTED SAMPLE',27,MUTED)
    text(d,(76,1820),'Silent study · original graphics · no client work',25,MUTED,False)
    return im

if __name__=='__main__':
    exe=shutil.which('ffmpeg')
    if not exe: raise SystemExit('FFmpeg with libx264 required')
    out=HERE/'route-study.mp4'
    cmd=[exe,'-nostdin','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','-metadata','title=Same city, different journey - fictional motion study',str(out)]
    p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for n in range(FPS*SECONDS):p.stdin.write(frame(n/FPS).tobytes())
    finally:p.stdin.close()
    if p.wait():raise SystemExit('Encoding failed')
    print(str(out))
