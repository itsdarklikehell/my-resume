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
    @page { size: A4; margin: 6mm; }
    @media print {
      body { zoom: 0.72 !important; font-size: 7.2pt !important; line-height: 1.12 !important; }
      .container { padding: 0 !important; }
      .header { padding: 0.55rem !important; margin-bottom: 0.45rem !important; gap: 0.55rem !important; }
      .header-avatar { width: 54px !important; height: 54px !important; }
      .header-info h1 { font-size: 1.25rem !important; }
      .header-info .tagline, .header-contact { font-size: 0.72rem !important; }
      .grid { grid-template-columns: minmax(0, 1fr) 175px !important; gap: 0.45rem !important; }
      .card { padding: 0.3rem !important; margin-bottom: 0.22rem !important; border-radius: 4px !important; }
      .card h2, h2 { font-size: 8pt !important; margin-bottom: 0.15rem !important; padding-bottom: 0.1rem !important; }
      .timeline-item { padding-left: 0.8rem !important; padding-bottom: 0.25rem !important; }
      .timeline-item .role { font-size: 7.3pt !important; }
      .timeline-item .company, .timeline-item .period, .timeline-item ul li { font-size: 6.6pt !important; margin-bottom: 0.05rem !important; }
      .timeline-item ul li { padding: 0 !important; }
      .about-text, .featured-project-card p { font-size: 6.8pt !important; line-height: 1.18 !important; }
      .tag { padding: 0.1rem 0.3rem !important; font-size: 6.5pt !important; }
      .footer { padding: 0.2rem 0 !important; font-size: 6.5pt !important; }
      #articles-section, #itchio-section, #volunteer-section, #courses-section,
      #skill-matrix-container, section.card:has(#skill-matrix-container),
      #portfolio-terminal, #repos-showcase-section, #gource-section,
      #contribution-heatmap, .portfolio-enhancements-card { display: none !important; }
      .featured-project-card { padding: 0.3rem !important; }
      .featured-project-card h4 { font-size: 7pt !important; margin-bottom: 0.15rem !important; }
      .featured-projects { padding: 0.35rem !important; margin: 0.3rem 0 !important; }
      .project-media-gallery, .project-architecture { display: none !important; }
      .timeline-item, .card, .featured-project-card { break-inside: avoid !important; page-break-inside: avoid !important; }
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
