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
      
      // Try chromium-min first (smaller, faster, but may have library issues)
      // Fallback to full chromium if min fails
      let chromiumModule;
      let chromium;
      let useChromiumMin = false;
      
      try {
        // Try chromium-min first - it's smaller and faster
        chromiumModule = await import("@sparticuz/chromium-min");
        chromium = chromiumModule.default || chromiumModule;
        useChromiumMin = true;
        console.log("Using @sparticuz/chromium-min (minimal version)");
      } catch (minError) {
        console.warn("Failed to import chromium-min, trying full chromium...", minError);
        // Fallback to full chromium
        chromiumModule = await import("@sparticuz/chromium");
        chromium = chromiumModule.default || chromiumModule;
        console.log("Using @sparticuz/chromium (full version with all libraries)");
      }
      
      // Configure chromium for serverless environments
      if (chromium.setGraphicsMode !== undefined) {
        chromium.setGraphicsMode = false;
      }
      
      // Get executable path
      // For chromium-min, try default first (it handles version internally)
      // For full chromium, use v119 which is more stable
      let executablePath: string;
      
      if (useChromiumMin) {
        try {
          // chromium-min handles version internally, use default
          executablePath = await chromium.executablePath();
          console.log("Using chromium-min default path:", executablePath);
        } catch (minError) {
          console.warn("chromium-min default failed, trying v119...", minError);
          // Fallback to v119
          executablePath = await chromium.executablePath(
            `https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar`
          );
          console.log("Using chromium-min v119 path:", executablePath);
        }
      } else {
        // Full chromium - use v119 which is more stable and tested
        const chromiumVersion = "v119.0.2";
        executablePath = await chromium.executablePath(
          `https://github.com/Sparticuz/chromium/releases/download/${chromiumVersion}/chromium-${chromiumVersion}-pack.tar`
        );
        console.log(`Using Chromium ${chromiumVersion} (stable for Vercel), executable path:`, executablePath);
      }
      
      // Additional args to fix libnss3.so and other library issues
      // Critical: --single-process and --no-zygote are essential for Vercel
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
        '--disable-features=TranslateUI,BlinkGenPropertyTrees',
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
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
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

  // Check if custom Chromium path is provided via environment variable
  // Usage: CHROMIUM_PATH=/usr/bin/chromium-browser
  // This allows manual installation: sudo apt-get install chromium-browser
  // Then set: export CHROMIUM_PATH=/usr/bin/chromium-browser
  const customChromiumPath = process.env.CHROMIUM_PATH;
  if (customChromiumPath) {
    const fs = await import('fs');
    if (fs.existsSync(customChromiumPath)) {
      console.log("Using custom Chromium path from CHROMIUM_PATH:", customChromiumPath);
      launchOptions.executablePath = customChromiumPath;
      return puppeteer.launch(launchOptions);
    } else {
      console.warn(`CHROMIUM_PATH specified but file not found: ${customChromiumPath}`);
    }
  }

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

  // On Linux, try to use system Chromium if available
  // Supports: sudo apt-get install chromium-browser
  // Puppeteer will automatically detect and use: /usr/bin/chromium-browser
  if (!isWindows && !isProd) {
    const fs = await import('fs');
    const possiblePaths = [
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
    ];

    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        console.log("Using system Chromium/Chrome:", path);
        launchOptions.executablePath = path;
        break;
      }
    }
  }

  return puppeteer.launch(launchOptions);
}