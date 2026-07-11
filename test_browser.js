import { chromium } from "playwright";
import path from "path";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("Navigating to http://localhost:5176/ ...");

  // Capture console messages
  page.on("console", (msg) => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  // Capture page errors
  page.on("pageerror", (err) => {
    console.error("[BROWSER ERROR]", err);
  });

  try {
    await page.goto("http://localhost:5176/", { waitUntil: "networkidle" });
    console.log("Page loaded successfully.");
    
    // Take a screenshot
    const screenshotPath = path.resolve("C:/Users/alika/.gemini/antigravity-ide/brain/46b5bb45-52b1-442b-96fd-6bbfe5489c1b/scratch_screenshot.png");
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    // Print body HTML to see what is there
    const content = await page.content();
    console.log("HTML Content summary (first 1000 chars):", content.substring(0, 1000));
  } catch (error) {
    console.error("Navigation failed:", error);
  } finally {
    await browser.close();
  }
})();
