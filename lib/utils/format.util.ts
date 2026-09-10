/**
 * Formats a monetary amount by rounding to the nearest integer without any decimals (.00).
 * Examples:
 *  199.00 -> "199"
 *  199.50 -> "200"
 *  "199.00" -> "199"
 */
export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";
  return Math.round(num).toString();
}

/**
 * Returns a rounded number without decimals.
 */
export function roundAmount(amount: number | string | null | undefined): number {
  if (amount === null || amount === undefined) return 0;
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return isNaN(num) ? 0 : Math.round(num);
}
