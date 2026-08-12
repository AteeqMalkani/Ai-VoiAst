// src/services/apps/browser.ts
import * as WebBrowser from "expo-web-browser";

/**
 * Opens a web URL in an in-app browser overlay.
 */
export async function openWebPage(url: string): Promise<void> {
  try {
    let formattedUrl = url.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }
    await WebBrowser.openBrowserAsync(formattedUrl);
  } catch (error) {
    console.error("[Browser Service Error]:", error);
    throw new Error("Could not open web browser.");
  }
}

/**
 * Executes a search query on Google via in-app browser.
 */
export async function searchWeb(query: string): Promise<void> {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  await openWebPage(searchUrl);
}
