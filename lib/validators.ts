/**
 * Validates a Sri Lankan phone number.
 *
 * Accepted formats (spaces stripped before testing):
 *   - Local mobile / landline:  0XXXXXXXXX  (10 digits starting with 0)
 *   - International:           +94XXXXXXXXX (+ 94 followed by 9 digits)
 *
 * Examples:
 *   0712345678  ✓
 *   +94712345678 ✓
 *   07 123 45 678 ✓  (spaces stripped)
 */
export function validateSriLankanMobile(mobile: string): boolean {
  const normalised = mobile.replace(/\s/g, "");
  return /^(\+94|0)\d{9}$/.test(normalised);
}

export const SL_MOBILE_ERROR =
  "Please enter a valid Sri Lankan number (e.g. +94712345678 or 0712345678)";

/** Validates that the email is a Gmail address. */
export function validateGmail(email: string): boolean {
  const normalised = email.trim().toLowerCase();
  return /^[^\s@]+@gmail\.com$/.test(normalised);
}

export const GMAIL_ERROR =
  "Please enter a valid Gmail address (e.g. you@gmail.com)";
