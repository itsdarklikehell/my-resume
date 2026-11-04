import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.CV_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });

  page.on("pageerror", (error) => {
    console.warn("Page JavaScript error:", error.message);
  });

  const response = await page.goto(baseUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  if (!response?.ok()) {
    throw new Error(`CV page returned HTTP ${response?.status() ?? "no response"} at ${baseUrl}`);
  }

  await page.addStyleTag({ content: `
    @page { size: A4; margin: 8mm; }
    @media print {
      body { zoom: 0.82 !important; font-size: 8pt !important; line-height: 1.16 !important; }
      .container { max-width: none !important; padding: 0 !important; }
      .header { padding: 0.45rem !important; margin-bottom: 0.4rem !important; gap: 0.5rem !important; }
      .header-avatar { width: 48px !important; height: 48px !important; }
      .header-info h1 { font-size: 1.2rem !important; }
      .header-info .tagline, .header-contact { font-size: 0.75rem !important; }
      .grid { grid-template-columns: minmax(0, 1fr) 155px !important; gap: 0.4rem !important; }
      .card { padding: 0.35rem !important; margin-bottom: 0.25rem !important; border-radius: 4px !important; }
      .card h2, h2 { font-size: 8.5pt !important; margin-bottom: 0.18rem !important; padding-bottom: 0.1rem !important; }
      .timeline-item { padding-left: 0.7rem !important; padding-bottom: 0.2rem !important; }
      .timeline-item .role { font-size: 8pt !important; }
      .timeline-item .company, .timeline-item .period, .timeline-item ul li { font-size: 7.2pt !important; margin-bottom: 0.04rem !important; }
      .timeline-item ul li { padding: 0 !important; }
      .about-text, .featured-project-card p { font-size: 7.4pt !important; line-height: 1.16 !important; }
      .tag { padding: 0.08rem 0.25rem !important; font-size: 7pt !important; }
      .footer { padding: 0.15rem 0 !important; font-size: 7pt !important; }
      #articles-section, #itchio-section, #volunteer-section, #courses-section,
      #skill-matrix-container, section.card:has(#skill-matrix-container),
      #portfolio-terminal, #repos-showcase-section, #gource-section,
      #contribution-heatmap, .portfolio-enhancements-card,
      #projects-section, #featured-section, #proficiency-section,
      .recruiter-quicklinks, .hero-updated, .section-updated,
      .no-print, .project-media-gallery, .project-architecture { display: none !important; }
      .featured-project-card { padding: 0.25rem !important; }
      .featured-project-card h4 { font-size: 7.5pt !important; margin-bottom: 0.12rem !important; }
      .featured-projects { padding: 0.25rem !important; margin: 0.2rem 0 !important; }
      .timeline-item, .card, .featured-project-card { break-inside: avoid !important; page-break-inside: avoid !important; }
      a { color: inherit !important; text-decoration: none !important; }
      a[href^="http"]:after { content: "" !important; }
    }` });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(async () => {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  });

  await mkdir("artifacts", { recursive: true });
  await page.pdf({
    path: "artifacts/cv-print.pdf",
    format: "A4",
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
    scale: 1,
    tagged: true,
  });

  console.log(`Printed ${baseUrl} to artifacts/cv-print.pdf`);
} finally {
  await browser.close();
}
