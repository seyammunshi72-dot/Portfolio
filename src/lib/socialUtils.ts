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

export function formatSocialUrl(platform: 'instagram' | 'facebook' | 'youtube' | 'generic', input?: string): string {
  if (!input || !input.trim() || input.trim() === '#') return '';
  let val = input.trim();

  // If already starts with protocol or mailto/tel
  if (/^https?:\/\//i.test(val) || /^mailto:/i.test(val) || /^tel:/i.test(val)) {
    return val;
  }

  // Strip leading '@' symbol if user entered @username
  val = val.replace(/^@/, '');

  if (platform === 'instagram') {
    val = val.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, '');
    return `https://instagram.com/${val}`;
  }

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
