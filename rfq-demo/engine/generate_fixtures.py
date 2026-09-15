"""Reproducible fictional English text PDFs in one deliberately strict layout."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
BASE=Path(__file__).resolve().parent/'fixtures'
STANDARD=[
 ('CBL-001','Copper cable 2.5 mm','0.145','M'),
 ('BRK-010','Single pole breaker 10 A','2','EA'),
 ('NOT-FOUND','Unlisted fixture part','1','EA'),
 ('NOPRICE-01','Terminal block','3','EA'),
 ('DUP-001','Cable gland small','4','EA'),
 ('SOCK-001','Black wall socket','1','EA'),
 ('CBL-001','Copper cable 2.5 mm','2','EA'),
 ('FREE-001','Sample identification tag','1','EA'),
]
UNSEEN=[
 ('SOCK-001','White wall socket','3','EA'),
 ('CBL-001','Copper cable 2.5 mm','1.005','M'),
 ('BRK-010','Single pole breaker 10 A','1','EA'),
 ('HOLD-001','Plastic cable clip','10','EA'),
]
def write_fixture(path,rfq_id,rows):
 c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('Synthetic RFQ demonstration - '+rfq_id);c.setAuthor('Receipt Work AI-assisted sample')
 lines=['RFQ-DEMO-V1','SYNTHETIC SAMPLE - NOT A CUSTOMER REQUEST','RFQ-ID: '+rfq_id,'CURRENCY: AED','CODE | DESCRIPTION | QTY | UNIT',*[' | '.join(row) for row in rows],'END-RFQ']
 for i,line in enumerate(lines):
  c.setFont('Courier-Bold' if i<5 or i==len(lines)-1 else 'Courier',9)
  c.drawString(28,A4[1]-38-i*22,line)
 c.showPage();c.save()
if __name__=='__main__':
 BASE.mkdir(exist_ok=True)
 write_fixture(BASE/'standard.pdf','DEMO-001',STANDARD)
 write_fixture(BASE/'unseen.pdf','DEMO-UNSEEN-002',UNSEEN)
 print('Wrote two synthetic fixtures; unseen means held-out rows, not buyer-provided acceptance evidence.')
