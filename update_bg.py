import os
import glob
import re

html_files = glob.glob('*.html')

new_body_css = """        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(-45deg, #e0e7ff, #fae8ff, #f0fdf4, #e0f2fe, #e0e7ff);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            background-attachment: fixed;
        }"""

pattern = re.compile(r'        body\s*\{\s*font-family:\s*\'Inter\',\s*sans-serif;\s*background:\s*linear-gradient\(135deg,\s*#e0e7ff\s*0%,\s*#fae8ff\s*50%,\s*#f0fdf4\s*100%\);\s*background-attachment:\s*fixed;\s*\}', re.MULTILINE)

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    if pattern.search(content):
        new_content = pattern.sub(new_body_css, content)
        with open(file, 'w') as f:
            f.write(new_content)
        print(f"Updated {file}")

