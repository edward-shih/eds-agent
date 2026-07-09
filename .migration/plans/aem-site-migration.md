# Single-Page Site Migration Plan: kellanovaawayfromhome.com

> **Target locked:** `https://www.kellanovaawayfromhome.com/` — homepage only. **All decisions confirmed** — clean slate: reset header/footer/nav to boilerplate, remove the contact-form/Support artifacts, and proceed with working-tree deletions (recoverable via git). **Execution requires switching to Execute mode.**

## Objective
Migrate the **homepage** of `https://www.kellanovaawayfromhome.com/` into this AEM Edge Delivery Services project — producing structured content (`content/*.plain.html`), block variants, import infrastructure, and validated local rendering — using the proven 7-step workflow, starting from a clean boilerplate slate.

## Scope
- **Source:** `https://www.kellanovaawayfromhome.com/` (homepage only)
- **Project type:** `doc` (document-based authoring) — already set in `.migration/project.json`
- **In scope:** WKND cleanup, content structure, block mapping, parsers/transformers, import, local preview verification
- **Out of scope (unless requested):** additional pages, design/style migration, header/nav, footer, commerce, forms

## Cleanup (Step 0 — reset to clean boilerplate)
All deletions are **working-tree only** (WKND work remains recoverable from git history).
- **Delete WKND content:** `content/index.plain.html`, `content/nav.plain.html`, `content/footer.plain.html`, and WKND-scraped images in `content/images/`
- **Delete WKND block variants:** `blocks/hero-feature`, `blocks/hero-overlay`, `blocks/columns-article`, `blocks/columns-gallery`, `blocks/tabs-testimonial`, `blocks/cards-article`, `blocks/accordion-faq`
- **Remove contact-form + Support artifacts:** `blocks/contact-form`, `drafts/support*` (parked Support task dropped)
- **Reset header/footer/nav to boilerplate:** restore `blocks/header/*` and `blocks/footer/*` to their boilerplate versions (via `git checkout` of committed boilerplate or revert of WKND edits); ensure no stale `content/nav.plain.html` remains
- **Regenerate/overwrite:** clear and rebuild `migration-work/` and `tools/importer/` (parsers, transformers, page-templates.json, import scripts)
- **Reset global styles to boilerplate:** revert `styles/styles.css` and remove/neutralize `styles/brand.css` (WKND tokens: Syncopate/Instrument Sans, black/grey) so the new site starts unstyled; head.html font links reverted. (Kellanova design applied later only if design migration is requested.)
- **Preserve:** boilerplate blocks `blocks/cards`, `blocks/columns`, `blocks/hero`, `blocks/fragment`, `blocks/widget`; core `scripts/`, `head.html` structure, `404.html`, config files
- **Restart dev server** in normal mode (currently running with `--html-folder drafts`)

## Migration Workflow (7 steps)
1. **Project Setup** — confirm/refresh `.migration/project.json` (type + block library endpoint).
2. **Site Analysis** — scrape the homepage (dismiss consent banner if present), extract structural skeleton, create a fresh template entry in `tools/importer/page-templates.json`.
3. **Page Analysis** — analyze DOM, identify sections, decide default-content vs blocks, create new block variants (JS/CSS) as needed.
4. **Block Mapping** — populate `page-templates.json` with DOM selectors, section styling, block mappings; cache per-block context.
5. **Import Infrastructure** — generate per-variant parsers + site-wide transformers (cleanup + sections); run DM/Scene7 steps only if DM URLs are detected.
6. **Import Script + Content Import** — generate & bundle the import script, run it, produce `content/<page>.plain.html` + report.
7. **Preview & Verify** — render locally, compare structure/content vs source, iterate on parsers/transformers until faithful.

## Key Considerations
- **Kellanova (food-service/CPG) brand site** — likely product-showcase, brand-story, and content-card layouts; expect **new block variants** distinct from WKND.
- Watch for: cookie/consent banner (dismiss before scraping), Dynamic Media/Scene7 imagery (adds transformer + auto-block install steps), heavy JS-framework markup.

## Post-Migration (optional — offered after step 7)
- Design/style migration (global tokens + per-block styling for Kellanova)
- Header/navigation migration
- Footer migration

## Checklist
- [ ] Step 0: Remove WKND content (`content/*.plain.html`, WKND images)
- [ ] Step 0: Remove WKND block variants (hero-feature, hero-overlay, columns-article, columns-gallery, tabs-testimonial, cards-article, accordion-faq)
- [ ] Step 0: Remove `blocks/contact-form` and `drafts/support*`
- [ ] Step 0: Reset `blocks/header`, `blocks/footer`, and nav to boilerplate
- [ ] Step 0: Revert global styles (`styles/styles.css`, `styles/brand.css`, head.html fonts) to boilerplate
- [ ] Step 0: Clear/regenerate `migration-work/` and `tools/importer/`; restart dev server in normal mode
- [ ] Step 1: Confirm project setup (`.migration/project.json`)
- [ ] Step 2: Site analysis — scrape homepage (+ dismiss consent), create template skeleton
- [ ] Step 3: Page analysis — sections, authoring decisions, new block variants
- [ ] Step 4: Block mapping — selectors + section styling in `page-templates.json`
- [ ] Step 5: Import infrastructure — parsers + transformers (+ DM steps only if DM URLs found)
- [ ] Step 6: Generate import script, bundle, run content import
- [ ] Step 7: Preview imported homepage & verify against source; iterate
- [ ] Report results and offer design / header / footer follow-ups

## Notes
- **Git safety:** No destructive git operations. Cleanup uses working-tree file deletions and `git checkout`/revert of committed boilerplate files only — all WKND work stays recoverable from history.
- **Execution:** This plan is ready. Switch to **Execute mode** to run it.
