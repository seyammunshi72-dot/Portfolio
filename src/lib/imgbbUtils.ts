/**
 * Utilities for parsing and formatting ImgBB and web GIF URLs
 */

export function extractImgbbUrl(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // 1. If user pasted HTML embed code like <img src="https://i.ibb.co/xyz/image.gif" ... />
  const htmlMatch = trimmed.match(/src=["'](https?:\/\/[^"']+)["']/i);
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }

  // 2. If user pasted Markdown like [![image](https://i.ibb.co/xyz/image.gif)](https://ibb.co/xyz)
  const mdMatch = trimmed.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/i);
  if (mdMatch && mdMatch[1]) {
    return mdMatch[1];
  }

  // 3. If user pasted BBCode like [img]https://i.ibb.co/xyz/image.gif[/img]
  const bbMatch = trimmed.match(/\[img\](https?:\/\/[^\[]+)\[\/img\]/i);
  if (bbMatch && bbMatch[1]) {
    return bbMatch[1];
  }

  // 4. If direct URL already (i.ibb.co, i.ibb.co.com)
  if (trimmed.includes('i.ibb.co') || trimmed.includes('i.ibb.co.com')) {
    return trimmed;
  }

  return trimmed;
}

export function isImgbbUrl(url: string): boolean {
  if (!url) return false;
  return /ibb\.co/i.test(url);
}

export function isDirectGifOrImage(url: string): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.gif') ||
    clean.endsWith('.webp') ||
    clean.endsWith('.png') ||
    clean.endsWith('.jpg') ||
    clean.endsWith('.jpeg') ||
    url.startsWith('data:image/') ||
    url.includes('i.ibb.co') ||
    url.includes('i.ibb.co.com')
  );
}

/**
 * Attempts to resolve an ibb.co viewer page (e.g. https://ibb.co/xyz)
 * to its underlying direct CDN image URL (https://i.ibb.co/...)
 */
export async function resolveViewerPageToDirectUrl(viewerUrl: string): Promise<string | null> {
  const url = viewerUrl.trim();
  if (!url.includes('ibb.co') || url.includes('i.ibb.co')) {
    return url;
  }

  try {
    // Attempt fetching via public CORS proxy to extract og:image or direct img src
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) return null;
    const html = await res.text();
    
    // Look for og:image meta tag
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1]) {
      return ogMatch[1];
    }
    
    // Look for image-viewer-container img src
    const imgMatch = html.match(/<img[^>]*id=["']image-viewer-container["'][^>]*src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }

    // Look for any i.ibb.co URL inside html
    const anyIbbMatch = html.match(/https:\/\/i\.ibb\.co(?:\.com)?\/[a-zA-Z0-9_\-\/]+\.[a-zA-Z0-9]+/i);
    if (anyIbbMatch && anyIbbMatch[0]) {
      return anyIbbMatch[0];
    }
  } catch (err) {
    console.warn('Could not auto-resolve ibb.co viewer page:', err);
  }

  return null;
}
