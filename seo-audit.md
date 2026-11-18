# SEO and crawlability audit

Last verified: 2026-11-18  
Site: https://itsdarklikehell.github.io/my-resume/

This file records the current implementation. The Playwright regression test
`SEO metadata, structured data and crawl files stay consistent` checks the
high-value metadata and crawl directives so this audit does not silently go stale.

## Verified implementation

- Dutch page title, description, author and keywords metadata are present.
- Canonical URL points to the GitHub Pages homepage.
- Open Graph title, description, image, dimensions, URL, type and image alt text are present.
- Twitter large-image card metadata includes title, description, image and image alt text.
- JSON-LD describes the person, includes a description, canonical `mainEntityOfPage`,
  contact fields, languages, areas of knowledge and public profile links.
- Content Security Policy is present in the document head.
- `robots.txt` allows public crawling and advertises the sitemap.
- `sitemap.xml` includes the homepage and all three multilingual technical case-study URLs.
- `.well-known/security.txt` provides a security contact and encryption reference.
- The primary profile image is preloaded as the page's likely Largest Contentful Paint image.
- Lighthouse CI audits performance, accessibility, best practices and SEO. Accessibility
  is enforced as an error threshold; other category thresholds currently warn.

## Follow-up considerations

- Keep sitemap `lastmod` values aligned with real content changes; do not update them on every build.
- Add language-specific canonical/hreflang metadata only if separate indexable language URLs are introduced.
- Add social profile attribution metadata only when a verified Twitter/X account is intended.
- Keep third-party analytics disabled by default; current interaction counters remain browser-local.

## Privacy notes

The structured data contains public professional contact details and public profile links.
Review these before publishing any new fields. Do not add private identifiers, precise home
address data, or unverified employer relationships.
