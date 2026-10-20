# SEO Audit — https://itsdarklikehell.github.io/my-resume/

Audited files: index.html, robots.txt, sitemap.xml, .well-known/* (none extra)
Repo: /tmp/my-resume-improve

## Current State
- Meta description: present (Dutch), 85 chars — OK
- OG tags: title, description, image (1200x630), url, type — present
- Twitter card: `summary_large_image` + title/desc/image — present; missing `twitter:image:alt`
- Canonical: `<link rel="canonical" href="https://itsdarklikehell.github.io/my-resume/">` — present
- robots.txt: permissive (`Allow: /`) — present
- sitemap.xml: single URL, lastmod=2026-10-20, monthly, 1.0 — present
- JSON-LD: `Person` schema with name, jobTitle, url, image, email, address, knowsLanguage, knowsAbout, sameAs — present
- CSP meta tag present
- `lang="nl"` set

## Gaps / Improvements
1. **Twitter card** — add `twitter:image:alt` (currently missing); also add `twitter:site` / `twitter:creator` if account exists.
2. **JSON-LD** — add `description` (bio summary) and `mainEntityOfPage` pointing to canonical URL. Add `worksFor` org if applicable. `telephone` masked (`+316****5494`) — fine for privacy.
3. **Meta** — add `keywords` meta for ICT/professional terms (optional, low SEO weight but harmless). Ensure `<meta name="author" content="Bauke Molenaar">` is present (not seen).
4. **Sitemap** — add `<changefreq>weekly</changefreq>` for active resume; ensure `lastmod` updates on content change.
5. **robots.txt** — fine, but could reference sitemap: `Sitemap: https://itsdarklikehell.github.io/my-resume/sitemap.xml`
6. **.well-known** — no `security.txt` or `.well-known/security.txt`. Reference `references/seo-files.md` recommends it.
7. **OG / Twitter image alt** — `og:image:alt` exists; add matching `twitter:image:alt`.
8. **Language / hreflang** — if multi-language (README.de, .fr, .nl), no `hreflang` links in HTML head. Not critical for single-page.
9. **Performance / accessibility** — CSP already present; consider `loading="lazy"` on images, `preload` for LCP.
10. **Canonical** — good; verify it matches the live URL exactly (it does).

## Suggested Edits (minimal)
- In `<head>` after twitter:image, add: `<meta content="Bauke Molenaar — technisch professional" name="twitter:image:alt"/>`
- In robots.txt, add sitemap line.
- In JSON-LD, add `"description": "Technisch professional met passie voor ICT..."` and `"mainEntityOfPage": {"@type":"WebPage","@id":"https://..."}`.
- Add `<meta name="author" content="Bauke Molenaar">` after viewport.

No major structural issues. Site is well-optimized for a GitHub Pages resume.
