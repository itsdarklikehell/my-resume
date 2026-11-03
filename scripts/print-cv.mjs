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
