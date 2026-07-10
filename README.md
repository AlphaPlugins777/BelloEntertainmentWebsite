# Bello Entertainment

Marketing website for **Bello Entertainment** — a premier DJ &amp; event entertainment company
for weddings, sweet sixteens, communions and private celebrations.

## Structure

```
BelloEntertainmentWebsite/
├── index.html       # Home / landing page
├── packages.html    # Packages & pricing
├── css/styles.css   # Design system (dark theme, white accents)
└── js/main.js       # Nav, scroll reveal, smooth scroll
```

## Running locally

It's a static site — just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Notes

- Fonts: Cormorant Garamond (display) + Jost (body) via Google Fonts.
- Hero/section images currently load from Unsplash URLs and need an internet
  connection. Swap in local photos under an `images/` folder to make it offline.
- Contact details, pricing and testimonials are placeholders — update before launch.
