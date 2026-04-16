# GreatestFemaleWrestlers

Static GitHub Pages website for exploring:

1. PWI women's rankings by year (partial, fair-use-friendly data with attribution)
2. Curated all-time lists by promotion with scoring breakdowns

## Site structure

- `index.html` - home and navigation
- `pwi.html` - PWI year selector + search
- `all-time.html` - all-time rankings by promotion
- `methodology.html` - ranking methodology
- `sources.html` - rendered attribution and citations

## Data model

- `data/pwi/index.json` - available PWI year metadata
- `data/pwi/<year>.json` - partial ranking data by year
- `data/all-time/promotions.json` - all-time rankings by promotion
- `data/sources.json` - source metadata for rendered sources page

## GitHub Pages

Set GitHub Pages to deploy from the repository root branch. The site is static and has no build step.
