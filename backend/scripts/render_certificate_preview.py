import os
from PIL import Image, ImageDraw, ImageFont
import qrcode

def generate_preview():
    template_path = 'backend/assets/certificate-template-clean.png'
    sig_path = 'backend/assets/signature.png'
    out_path = 'C:/Users/shiva/.gemini/antigravity/brain/7fe6fe1c-ab5f-4c3b-a819-417751ae83f3/devascent_master_certificate_sample.jpg'
    
    if not os.path.exists(template_path):
        print(f"Error: {template_path} not found")
        return

    base = Image.open(template_path).convert('RGB')
    w, h = base.size
    draw = ImageDraw.Draw(base)

    # Fonts
    # On Windows, try Times New Roman Bold Italic / Arial
    try:
        font_cert_id = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 13)
        font_name = ImageFont.truetype('C:/Windows/Fonts/timesbi.ttf', 58)
        font_cite1 = ImageFont.truetype('C:/Windows/Fonts/times.ttf', 19)
        font_cite2 = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', 22)
    except Exception as e:
        print("Fallback font due to:", e)
        font_cert_id = font_name = font_cite1 = font_cite2 = ImageFont.load_default()

    # 1. Credential ID inside blue badge
    cert_id = "DEV-CERT-2026-9482"
    draw.text((120, 105), cert_id, font=font_cert_id, fill=(15, 44, 89))

    # 2. Student Name
    student_name = "Shivan Mishra"
    # Measure text to center
    bbox = font_name.getbbox(student_name)
    name_w = bbox[2] - bbox[0]
    name_x = (w - name_w) // 2
    draw.text((name_x, 325), student_name, font=font_name, fill=(15, 23, 42))

    # 3. Citation narrative
    line1 = "for successfully completing an intensive 08 Weeks Virtual Internship in"
    line2 = "Full-Stack Cloud & AI Software Engineering at DevAscent Academy"
    line3 = "from 15 January 2026 to 15 March 2026."

    for text, font, fill, y in [
        (line1, font_cite1, (30, 41, 59), 444),
        (line2, font_cite2, (15, 23, 42), 470),
        (line3, font_cite1, (30, 41, 59), 498),
    ]:
        bbox = font.getbbox(text)
        tw = bbox[2] - bbox[0]
        tx = (w - tw) // 2
        draw.text((tx, y), text, font=font, fill=fill)

    # 4. QR Code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=4,
        border=1,
    )
    qr.add_data("https://dev-ascent-academy.vercel.app/verify/DEV-CERT-2026-9482")
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#0F172A", back_color="white").convert('RGB')
    qr_img = qr_img.resize((106, 106), Image.Resampling.LANCZOS)
    base.paste(qr_img, (136, 545))

    # 5. Signature
    if os.path.exists(sig_path):
        sig_img = Image.open(sig_path).convert('RGBA')
        # resize signature keeping aspect ratio
        sig_w = 145
        aspect = sig_img.height / sig_img.width
        sig_h = int(sig_w * aspect)
        sig_img = sig_img.resize((sig_w, sig_h), Image.Resampling.LANCZOS)
        
        # Paste with alpha
        sig_y = 620 - sig_h
        base.paste(sig_img, (765, sig_y), sig_img)

    base.save(out_path, quality=96)
    print("Preview image saved to:", out_path)

if __name__ == '__main__':
    generate_preview()

