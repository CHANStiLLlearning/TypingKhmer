import os
import sys
from PIL import Image

def generate_icons(png_path='build/icon.png'):
    if not os.path.exists(png_path):
        print(f"Error: {png_path} does not exist.")
        sys.exit(1)

    img = Image.open(png_path).convert('RGBA')

    # Ensure square
    w, h = img.size
    if w != h:
        dim = min(w, h)
        img = img.crop(((w - dim) // 2, (h - dim) // 2, (w + dim) // 2, (h + dim) // 2))

    # Standard Windows ICO sizes
    ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    
    # Save build/icon.ico
    os.makedirs('build', exist_ok=True)
    img.save('build/icon.ico', format='ICO', sizes=ico_sizes)
    print("Saved build/icon.ico successfully.")

    # Save 512x512 high-res png
    icon_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save('build/icon.png', format='PNG')
    print("Saved build/icon.png (512x512).")

    # Save to public/ for web
    os.makedirs('public', exist_ok=True)
    img.resize((192, 192), Image.Resampling.LANCZOS).save('public/icon.png', format='PNG')
    img.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print("Saved public/icon.png and public/favicon.ico.")

if __name__ == '__main__':
    src = sys.argv[1] if len(sys.argv) > 1 else 'build/icon.png'
    generate_icons(src)

