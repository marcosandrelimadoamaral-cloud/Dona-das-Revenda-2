from PIL import Image
import os

src = r'C:\Users\User\Desktop\Dona-da-Revenda-main\Dona-da-Revenda-main\apps\web\public\logo.png'
out_dir = r'C:\Users\User\Desktop\Dona-da-Revenda-main\Dona-da-Revenda-main\apps\web\public\icons'
os.makedirs(out_dir, exist_ok=True)

logo = Image.open(src).convert('RGBA')

for size in [192, 512]:
    # Create square canvas with indigo background
    canvas = Image.new('RGBA', (size, size), (99, 102, 241, 255))  # #6366f1
    
    # Scale logo to 80% of the icon size, keeping aspect ratio
    icon_size = int(size * 0.75)
    logo_resized = logo.resize((icon_size, icon_size), Image.LANCZOS)
    
    # Center it on the canvas
    offset = (size - icon_size) // 2
    canvas.paste(logo_resized, (offset, offset), logo_resized)
    
    # Save as PNG (convert to RGB for compatibility)
    out = canvas.convert('RGB')
    out.save(os.path.join(out_dir, f'icon-{size}x{size}.png'), 'PNG')
    print(f'Created icon-{size}x{size}.png')

print('Done')
