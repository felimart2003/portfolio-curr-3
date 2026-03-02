# Portfolio Resume 3
My portfolio resume as of 02/3/2026.
I am at Carleton University completing my degree of "Bachelor of Computer Science Honours: Cybersecurity Stream (Co-op) with Statistics Minor". 

A modern, dark-themed portfolio website with glassmorphism effects, particle animations, scroll-reveal transitions, and interactive tilt cards. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

## Quick Start

1. Open `index.html` in your browser, or use a local server:
   ```bash
   # Python
   python -m http.server 8000

   # Node.js (npx)
   npx serve .
   ```

2. Visit `http://localhost:8000`

## Adding Your Content

### Images
Place your files in `assets/images/`:

| File | Description | Recommended Size |
|------|------------|-----------------|
| `profile.jpg` | Your headshot / profile photo | 500×500px (square) |
| `project-1.png` | Featured project 1 screenshot | 1920×1200px (16:10) |
| `project-2.png` | Featured project 2 screenshot | 1920×1200px (16:10) |
| `project-3.png` | Featured project 3 screenshot | 1920×1200px (16:10) |

> The site gracefully falls back to `placeholder.svg` if `profile.jpg` is missing.

### Resume
Place your resume PDF at:
```
assets/resume.pdf
```
The navbar "Resume" button and any resume links will open this file.

### What To Customise in `index.html`

| Section | What to change |
|---------|---------------|
| **Hero** | Your name, tagline, description |
| **About** | Bio paragraphs, technology list |
| **Education** | Dates, university name, coursework, achievements |
| **Skills** | Add/remove skill categories and items |
| **Projects** | Project titles, descriptions, tech stacks, GitHub/demo links |
| **Experience** | Job titles, companies, dates, bullet points |
| **Contact** | Email address (`your.email@example.com`) |
| **Footer** | Social media links (GitHub, LinkedIn) |

## File Structure
```
portfolio-curr-2/
├── index.html              # Main page
├── css/
│   ├── style.css           # Core styles & layout
│   └── animations.css      # Scroll-reveal & micro-animations
├── js/
│   ├── main.js             # Navigation, tabs, cursor glow, scroll reveal
│   └── particles.js        # Canvas particle network background
├── assets/
│   ├── favicon.svg         # Browser tab icon
│   ├── resume.pdf          # ← ADD YOUR RESUME HERE
│   └── images/
│       ├── profile.jpg     # ← ADD YOUR PHOTO HERE
│       ├── project-1.png   # ← ADD PROJECT SCREENSHOTS
│       ├── project-2.png
│       ├── project-3.png
│       └── placeholder.svg # Fallback avatar
└── README.md
```

## Features

- **Particle Network** — interactive canvas particles that react to cursor movement
- **Cursor Glow** — subtle radial gradient follows your mouse across the page
- **Scroll Reveal** — elements animate in as you scroll, with staggered delays
- **3D Tilt Cards** — skill cards respond to mouse position with perspective transforms
- **Glassmorphism** — frosted glass card effects with backdrop blur
- **Tabbed Experience** — click-to-switch experience/role panels
- **Fully Responsive** — mobile hamburger menu, adjusted layouts for all breakpoints
- **Accessible** — semantic HTML, aria labels, keyboard navigable
- **Zero Dependencies** — no npm, no build step, pure HTML/CSS/JS

## Deployment

Works on any static host:
- **GitHub Pages** — push to `main`, enable Pages in repo settings
- **Netlify / Vercel** — connect repo, deploy automatically
- **Any web host** — upload all files to your public directory

## License

MIT — feel free to use, modify, and share.
