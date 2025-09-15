// src/components/validateEmail.ts

const ROLE_PREFIXES = new Set([
  "admin", "administrator", "support", "help", "noreply", "no-reply",
  "webmaster", "postmaster", "abuse", "sales", "info"
]);

export const DEFAULT_SUGGEST = [
  "gmail.com", "outlook.com", "yahoo.com", "icloud.com", "live.com",
  "hotmail.com", "proton.me", "rediffmail.com", "yahoo.co.in", "hotmail.co.in"
];


// Standard RFC-like email regex (no TLD/domain restriction)
// Standard, reliable email regex (no double dot lookahead, allows all valid emails)
export function buildRegex(allowedDomains: string[]) {
  // Build a regex that matches the full domain after @
  const domainPattern = allowedDomains.map(domain => domain.replace(/\./g, '\\.')).join('|');
  return new RegExp(`^[A-Za-z0-9._%+-]+@(${domainPattern})$`, 'i');
}
export function isAsciiOnly(s: string) {
  // Keep it simple on the client; add Punycode if you need IDNs.
  return /^[\x00-\x7F]+$/.test(s);
}

export function withinLengthLimits(email: string): string | null {
  // RFC-ish pragmatic limits
  if (email.length > 254) return "Email is too long (max 254 chars).";
  const at = email.indexOf("@");
  if (at === -1) return "Missing '@'.";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length === 0) return "Missing local part before '@'.";
  if (local.length > 64) return "Local part is too long (max 64 chars).";
  if (domain.length === 0) return "Missing domain after '@'.";
  if (domain.length > 253) return "Domain is too long (max 253 chars).";
  // Domain labels length check
  for (const label of domain.split(".")) {
    if (label.length < 1 || label.length > 63) {
      return "Each domain label must be 1–63 characters.";
    }
  }
  return null;
}

export function validateEmail(email: string, allowedTLDs = DEFAULT_SUGGEST): string | null {
  if (!isAsciiOnly(email)) return "Only ASCII characters are allowed.";
  const lengthError = withinLengthLimits(email);
  if (lengthError) return lengthError;
  const [local, domain] = email.split("@");
  if (!local || !domain) return "Invalid email format.";
  if (ROLE_PREFIXES.has(local.toLowerCase())) {
    return `Role-based email addresses like '${local}' are not allowed.`;
  }
  const regex = buildRegex(allowedTLDs);
  if (!regex.test(email)) {
    // Custom error for dot at end or double dot in domain
    if (domain.endsWith('.') || domain.includes('..')) {
      return ".' is used at a wrong position in '" + domain + "'.";
    }
    // Custom error for TLD restriction
    const tld = domain.split('.').pop();
    const allowedTLDSet = new Set(allowedTLDs.map(tld => tld.toLowerCase()));
    if (!allowedTLDs.some(allowed => domain.toLowerCase().endsWith(allowed))) {
      return "Please use a common email provider (e.g., gmail.com, outlook.com, yahoo.com, etc.).";
    }
    return "Please enter a valid email address.";
  }
  return null;
}