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
      // Use v119 for better stability with Vercel
      const executablePath = await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar`
      );
      
      console.log("Chromium executable path:", executablePath);
      
      return await puppeteerCore.launch({
        args: [
          ...chromium.args,
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-sandbox',
          '--no-zygote',
          '--single-process',
        ],
        executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      });
    } catch (error) {
      console.error("Failed to launch Chromium in serverless environment:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');
      
      // Don't fallback to puppeteer in production - it won't work
      throw new Error(`Chromium launch failed in serverless: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Use regular puppeteer for:
  // - Development (always)
  // - Windows (always, even in production)
  // - Non-serverless production
  // - When FORCE_PUPPETEER is set
  console.log("Using regular puppeteer (non-serverless or development)");
  
  const launchOptions: any = {
    headless: true,
    args: isProd ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  };

  // In development on Windows, try to use system Chrome if puppeteer's Chrome isn't installed
  if (!isProd && isWindows) {
    const possiblePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    ];

    // Try to find Chrome
    const fs = await import('fs');
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        console.log("Using system Chrome:", path);
        launchOptions.executablePath = path;
        break;
      }
    }
  }

  return puppeteer.launch(launchOptions);
}