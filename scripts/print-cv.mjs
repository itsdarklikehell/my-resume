import { chromium } from "playwright";
import { copyFile, mkdir } from "node:fs/promises";

const baseUrl = process.env.CV_URL || "http://127.0.0.1:4173/my-resume/";
const outputs = [{ lang: "nl", filename: "bauke-molenaar-cv.pdf" }, { lang: "en", filename: "bauke-molenaar-cv-en.pdf" }];
const PRINT_CSS = "\n    @page { size: A4; margin: 8mm; }\n    @media print {\n      body { zoom: 0.82 !important; font-size: 8pt !important; line-height: 1.16 !important; }\n      .container { max-width: none !important; padding: 0 !important; }\n      .header { padding: 0.45rem !important; margin-bottom: 0.4rem !important; gap: 0.5rem !important; }\n      .header-avatar { width: 48px !important; height: 48px !important; }\n      .header-info h1 { font-size: 1.2rem !important; }\n      .header-info .tagline, .header-contact { font-size: 0.75rem !important; }\n      .grid { grid-template-columns: minmax(0, 1fr) 155px !important; gap: 0.4rem !important; }\n      .card { padding: 0.35rem !important; margin-bottom: 0.25rem !important; border-radius: 4px !important; }\n      .card h2, h2 { font-size: 8.5pt !important; margin-bottom: 0.18rem !important; padding-bottom: 0.1rem !important; }\n      .timeline-item { padding-left: 0.7rem !important; padding-bottom: 0.2rem !important; }\n      .timeline-item .role { font-size: 8pt !important; }\n      .timeline-item .company, .timeline-item .period, .timeline-item ul li { font-size: 7.2pt !important; margin-bottom: 0.04rem !important; }\n      .timeline-item ul li { padding: 0 !important; }\n      .about-text, .featured-project-card p { font-size: 7.4pt !important; line-height: 1.16 !important; }\n      .tag { padding: 0.08rem 0.25rem !important; font-size: 7pt !important; }\n      .footer { padding: 0.15rem 0 !important; font-size: 7pt !important; }\n      #articles-section, #itchio-section, #volunteer-section, #courses-section,\n      #skill-matrix-container, section.card:has(#skill-matrix-container),\n      #portfolio-terminal, #repos-showcase-section, #gource-section,\n      #contribution-heatmap, .portfolio-enhancements-card,\n      #projects-section, #featured-section, #proficiency-section,\n      .recruiter-quicklinks, .hero-updated, .section-updated,\n      .no-print, .project-media-gallery, .project-architecture { display: none !important; }\n      .featured-project-card { padding: 0.25rem !important; }\n      .featured-project-card h4 { font-size: 7.5pt !important; margin-bottom: 0.12rem !important; }\n      .featured-projects { padding: 0.25rem !important; margin: 0.2rem 0 !important; }\n      .timeline-item, .card, .featured-project-card { break-inside: avoid !important; page-break-inside: avoid !important; }\n      a { color: inherit !important; text-decoration: none !important; }\n      a[href^=\"http\"]:after { content: \"\" !important; }\n    }";
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await mkdir("artifacts", { recursive: true });
  for (const output of outputs) {
    const target = new URL(baseUrl);
    target.searchParams.set("lang", output.lang);
    const response = await page.goto(target.toString(), { waitUntil: "domcontentloaded", timeout: 60_000 });
    if (!response?.ok()) throw new Error(`CV page returned HTTP ${response?.status() ?? "no response"} at ${target}`);
    await page.waitForFunction(() => Boolean(document.getElementById("hero-updated")?.textContent?.trim()), null, { timeout: 30_000 });
    await page.addStyleTag({ content: PRINT_CSS });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(async () => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 5000))]));
    await page.pdf({ path: output.filename, format: "A4", preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, scale: 1, tagged: true });
    await copyFile(output.filename, output.lang === "nl" ? "artifacts/cv-print.pdf" : "artifacts/cv-print-en.pdf");
    if (pageErrors.length) throw new Error(`CV page JavaScript errors: ${pageErrors.join("; ")}`);
    console.log(`Printed ${target} to ${output.filename}`);
    await page.emulateMedia({ media: "screen" });
  }
} finally { await browser.close(); }