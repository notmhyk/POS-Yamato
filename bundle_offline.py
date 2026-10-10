import os
import re
import base64

def bundle():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(base_dir, 'index.html')
    style_path = os.path.join(base_dir, 'style.css')
    app_path = os.path.join(base_dir, 'app.js')
    output_path = os.path.join(base_dir, 'Yamato_POS_Offline.html')

    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()

    with open(style_path, 'r', encoding='utf-8') as f:
        css = f.read()

    with open(app_path, 'r', encoding='utf-8') as f:
        js = f.read()

    # Replace external css link with inline style
    html = re.sub(r'<link rel="stylesheet" href="style\.css[^"]*">', f'<style>\n{css}\n</style>', html)

    # Replace external js link with inline script
    html = re.sub(r'<script src="app\.js[^"]*"></script>', f'<script>\n{js}\n</script>', html)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Successfully generated standalone offline POS: {output_path}")

if __name__ == '__main__':
    bundle()
