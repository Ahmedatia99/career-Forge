import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import os from "os";

const isProd = process.env.NODE_ENV === "production";
const isWindows = os.platform() === "win32";

// Check if we're in a serverless environment (AWS Lambda, Vercel, etc.)
const isServerless = 
  process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined ||
  process.env.VERCEL !== undefined ||
  process.env.SERVERLESS === "true";

// Allow forcing puppeteer mode via environment variable
const forcePuppeteer = process.env.FORCE_PUPPETEER === "true";

export async function launchBrowser() {
  console.log("Browser launch config:", {
    isProd,
    isWindows,
    isServerless,
    forcePuppeteer,
    platform: os.platform()
  });

  // NEVER use chromium-min on Windows - it causes protocol mismatch errors
  // Always use regular puppeteer on Windows, regardless of environment
  if (isWindows || forcePuppeteer) {
    console.log("Using regular puppeteer (Windows or forced)");
    return puppeteer.launch({
      headless: true,
      args: isProd ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
    });
  }

  // Only use chromium-min in actual serverless production environments (not on Windows)
  const shouldUseChromiumMin = isProd && isServerless;

  if (shouldUseChromiumMin) {
    try {
      console.log("Attempting to use @sparticuz/chromium-min for serverless...");
      
      // Dynamically import chromium-min only when needed (not on Windows)
      const chromiumModule = await import("@sparticuz/chromium-min");
      // Handle both default and named exports
      const chromium = chromiumModule.default || chromiumModule;
      
      // Configure chromium for serverless environments
      if (chromium.setGraphicsMode !== undefined) {
        chromium.setGraphicsMode = false;
      }
      
      // CRITICAL: Provide the Chromium binary URL
      // This is what was missing in your original code
      const executablePath = await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
      );
      
      console.log("Chromium executable path:", executablePath);
      
      return await puppeteerCore.launch({
        args: chromium.args,
        executablePath,
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport,
        ignoreHTTPSErrors: true,
      });
    } catch (error) {
      console.error("Failed to launch Chromium in serverless environment:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      
      // Fallback to regular puppeteer if chromium-min fails
      console.log("Falling back to regular puppeteer...");
      return puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
    }
  }

  // Use regular puppeteer for:
  // - Development (always)
  // - Windows (always, even in production)
  // - Non-serverless production
  // - When FORCE_PUPPETEER is set
  console.log("Using regular puppeteer (non-serverless or development)");
  return puppeteer.launch({
    headless: true,
    args: isProd ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  });
}