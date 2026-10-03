- [dna_office project basics](project_dna_office.md) — stack, manifest content pipeline, query-string routing

## 2026-09-30
- **Note:** caroline-maxwell-website page titles use "Caroline Maxwell — <Page>" (detail pages: "Caroline Maxwell — <Section> — <Name>").
- **Context:** User asked to put the site name first in all document.title values.

## 2026-10-01
- **Note:** Web image standard for caroline-maxwell-website artworks: max 2000px on the longest side, 72 DPI, JPEG quality ~85. Never upscale smaller images.
- **Context:** User asked to resize newly added artwork images to web format.

## 2026-10-02
- **Note:** dna_office has day/night mode: all colors are `--color-*` tokens in `src/index.css`; night values override them under `:root[data-theme="dark"]`. Use tokens (never raw hex) so new UI works in both modes. Choice stored in localStorage `dna-theme`, defaults to OS preference.
- **Context:** Added ThemeToggle in the header, left of Home / next to hamburger.
