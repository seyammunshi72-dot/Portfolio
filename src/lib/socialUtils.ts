/**
 * Utility functions for handling social links and phone numbers.
 * Ensures all social links (Instagram, Facebook, YouTube, WhatsApp)
 * work properly even if users enter bare handles or omit https://.
 */

export function cleanPhoneNumber(input?: string): string {
  if (!input) return '';
  return input.replace(/[^0-9]/g, '');
}

export function getWhatsAppChatUrl(phone?: string, customMessage?: string): string {
  const clean = cleanPhoneNumber(phone || '+8801786546949');
  if (!clean) return '';
  const msg = encodeURIComponent(
    customMessage || "Hi Seyam, I saw your portfolio and would like to discuss a video editing project!"
  );
  return `https://wa.me/${clean}?text=${msg}`;
}

export function extractInstagramUsername(input?: string): string {
  if (!input) return 'sey.am1';
  const clean = input
    .trim()
    .replace(/^[#@\s]+/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '')
    .trim();
  return clean.replace(/^@/, '') || 'sey.am1';
}

export function formatSocialUrl(platform: 'instagram' | 'facebook' | 'youtube' | 'generic', input?: string): string {
  if (!input || !input.trim() || input.trim() === '#') return '';
  let val = input.trim().replace(/^[#\s]+/, '');

  if (platform === 'instagram') {
    const user = extractInstagramUsername(val);
    return `https://instagram.com/${user}`;
  }

  // If already starts with protocol or mailto/tel
  if (/^https?:\/\//i.test(val) || /^mailto:/i.test(val) || /^tel:/i.test(val)) {
    return val;
  }

  // Strip leading '@' symbol if user entered @username
  val = val.replace(/^@/, '');

  if (platform === 'facebook') {
    val = val.replace(/^(https?:\/\/)?(www\.)?facebook\.com\//i, '');
    return `https://facebook.com/${val}`;
  }

  if (platform === 'youtube') {
    val = val.replace(/^(https?:\/\/)?(www\.)?youtube\.com\//i, '');
    return `https://youtube.com/${val}`;
  }

  // Generic fallback: prepend https://
  return `https://${val}`;
}
