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
      console.log("Attempting to use @sparticuz/chromium for serverless...");
      
      // Use @sparticuz/chromium (full version with all libraries including libnss3.so)
      const chromiumModule = await import("@sparticuz/chromium");
      const chromium = chromiumModule.default || chromiumModule;
      console.log("Using @sparticuz/chromium (full version with all libraries)");
      
      // Configure chromium for serverless environments
      if (chromium.setGraphicsMode !== undefined) {
        chromium.setGraphicsMode = false;
      }
      
      // Try v131 first, fallback to v119 if it fails
      let executablePath: string;
      let chromiumVersion = "v131.0.1";
      
      try {
        executablePath = await chromium.executablePath(
          `https://github.com/Sparticuz/chromium/releases/download/${chromiumVersion}/chromium-${chromiumVersion}-pack.tar`
        );
        console.log(`Using Chromium ${chromiumVersion}, executable path:`, executablePath);
      } catch (versionError) {
        console.warn(`Failed to get Chromium ${chromiumVersion}, trying v119...`, versionError);
        chromiumVersion = "v119.0.2";
        executablePath = await chromium.executablePath(
          `https://github.com/Sparticuz/chromium/releases/download/${chromiumVersion}/chromium-${chromiumVersion}-pack.tar`
        );
        console.log(`Using Chromium ${chromiumVersion}, executable path:`, executablePath);
      }
      
      // Additional args to fix libnss3.so and other library issues
      const launchArgs = [
        ...chromium.args,
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-features=TranslateUI',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-sync',
        '--disable-translate',
        '--metrics-recording-only',
        '--no-crash-upload',
        '--no-default-browser-check',
        '--no-pings',
        '--password-store=basic',
        '--use-mock-keychain',
      ];
      
      return await puppeteerCore.launch({
        args: launchArgs,
        executablePath,
        headless: chromium.headless !== false,
        ignoreHTTPSErrors: true,
        defaultViewport: chromium.defaultViewport,
      });
    } catch (error) {
      console.error("Failed to launch Chromium in serverless environment:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');
      
      // Try to provide more helpful error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('libnss3.so') || errorMessage.includes('shared libraries')) {
        throw new Error(
          `Chromium launch failed: Missing system libraries. ` +
          `This usually means the Chromium binary is incomplete. ` +
          `Try using a different Chromium version or check Vercel function configuration. ` +
          `Original error: ${errorMessage}`
        );
      }
      
      // Don't fallback to puppeteer in production - it won't work
      throw new Error(`Chromium launch failed in serverless: ${errorMessage}`);
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