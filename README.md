# diffusil® — Market Opportunity Report

A standalone React report app presenting the Node42 PCM (Product–Commodity–Market)
new-markets analysis for **diffusil®** (opsira GmbH). It renders the full analysis —
product decomposition, the two-path market universe, the PCM composite ranking,
JTBD dimensions, and Stage-3 value-network stakeholders — from a single bundled
data file.

## What's inside

- **8 pages** (React Router): Overview, Product, Market Universe, Ranking Detail,
  Dimensions, Stakeholders, Glossary, About.
- All UI is built with the vendored **`@node42/ui-kit`** component library
  (`packages/ui-kit`), so the app is self-contained with no sibling-folder
  dependencies.
- All content is read from `src/data/report.json` (typed via `src/report.d.ts`);
  no hardcoded or invented data.

## Run

```bash
npm install
npm run dev      # start the Vite dev server
```

## Build

```bash
npm run build    # tsc -b && vite build
npm run preview  # serve the production build locally
```

## Project layout

```
src/
  main.tsx          # router + 8 routes
  data.ts           # typed entry point for report.json
  report.d.ts       # Report interface
  sections.ts       # slugify helper (sidebar <-> section anchors)
  ReportSidebar.tsx # route-aware nav with section sub-items
  ReportPage.tsx    # PageTemplate chrome + Section wrapper
  pages/            # one file per route
  data/report.json  # the full report bundle
packages/ui-kit/    # vendored @node42/ui-kit source
```
