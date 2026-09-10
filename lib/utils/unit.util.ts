import { DisplayProduct } from "@/lib/mappers/product.mapper";
import { BackendSku } from "@/lib/api/product.service";

/**
 * Checks and normalizes a potential unit string.
 */
function checkValue(val: unknown): string | null {
  if (typeof val === "string" && val.trim()) {
    const clean = val.trim();
    const lower = clean.toLowerCase();

    // If unit indicates single piece, placeholder dash, or none, omit label
    if (
      clean === "-" ||
      clean === "--" ||
      clean === "—" ||
      clean === "–" ||
      lower === "single" ||
      lower === "single piece" ||
      lower === "1 piece" ||
      lower === "1 pc" ||
      lower === "1" ||
      lower === "none" ||
      lower === "n/a"
    ) {
      return null;
    }

    // Standard packaging short-codes
    if (lower === "dz" || lower === "dozen" || lower === "doz") return "DZ";
    if (lower === "pac" || lower === "pack") return "PAC";
    if (lower === "pc" || lower === "pcs" || lower === "piece") return "PC";

    // Clean leading slashes and uppercase
    const formatted = clean.replace(/^\/+\s*/, "").toUpperCase();
    if (formatted === "-" || formatted === "--") return null;
    return formatted;
  }
  return null;
}

/**
 * Extracts and formats the primary unit label (e.g. PC, DZ, PAC) for a product or selected SKU.
 */
export function getUnitLabel(product: DisplayProduct, currentSku?: BackendSku): string | null {
  // 1. Check currentSku direct properties and attributes
  if (currentSku) {
    const s = currentSku as Record<string, any>;
    const fromSku =
      checkValue(s.unitName) ||
      checkValue(s.unit_name) ||
      checkValue(s.unit) ||
      checkValue(s.pricingUnit) ||
      checkValue(s.priceUnit) ||
      checkValue(s.uom) ||
      checkValue(s.attributes?.unitName) ||
      checkValue(s.attributes?.["Unit Name"]) ||
      checkValue(s.attributes?.unit_name) ||
      checkValue(s.attributes?.unit) ||
      checkValue(s.attributes?.Unit) ||
      checkValue(s.attributes?.pricingUnit) ||
      checkValue(s.attributes?.format) ||
      checkValue(s.attributes?.Format);
    if (fromSku !== null) return fromSku;
  }

  // 2. Check product direct properties and attributes
  const p = product as Record<string, any>;
  const fromProduct =
    checkValue(p.unitName) ||
    checkValue(p.unit_name) ||
    checkValue(p.unit) ||
    checkValue(p.pricingUnit) ||
    checkValue(p.priceUnit) ||
    checkValue(p.uom) ||
    checkValue(p.attributes?.unitName) ||
    checkValue(p.attributes?.["Unit Name"]) ||
    checkValue(p.attributes?.unit_name) ||
    checkValue(p.attributes?.unit) ||
    checkValue(p.attributes?.Unit) ||
    checkValue(p.attributes?.pricingUnit) ||
    checkValue(p.attributes?.uom) ||
    checkValue(p.attributes?.package) ||
    checkValue(p.attributes?.packaging);
  if (fromProduct !== null) return fromProduct;

  // 3. Check defaultSku
  if (p.defaultSku) {
    const ds = p.defaultSku as Record<string, any>;
    const fromDefault =
      checkValue(ds.unitName) ||
      checkValue(ds.unit_name) ||
      checkValue(ds.unit) ||
      checkValue(ds.attributes?.unitName) ||
      checkValue(ds.attributes?.["Unit Name"]) ||
      checkValue(ds.attributes?.unit_name) ||
      checkValue(ds.attributes?.unit) ||
      checkValue(ds.attributes?.Unit) ||
      checkValue(ds.attributes?.format);
    if (fromDefault !== null) return fromDefault;
  }

  // 4. Check rawProduct if available
  if (p.rawProduct) {
    const raw = p.rawProduct as Record<string, any>;
    const fromRaw =
      checkValue(raw.unitName) ||
      checkValue(raw.unit_name) ||
      checkValue(raw.unit) ||
      checkValue(raw.pricingUnit) ||
      checkValue(raw.priceUnit) ||
      checkValue(raw.uom) ||
      checkValue(raw.attributes?.unitName) ||
      checkValue(raw.attributes?.["Unit Name"]) ||
      checkValue(raw.attributes?.unit_name) ||
      checkValue(raw.attributes?.unit) ||
      checkValue(raw.attributes?.Unit);
    if (fromRaw !== null) return fromRaw;

    // Search any key containing 'unit' in rawProduct
    for (const [k, v] of Object.entries(raw)) {
      if (/unit/i.test(k) && typeof v === "string") {
        const res = checkValue(v);
        if (res !== null) return res;
      }
    }
  }

  // 5. Search any key containing 'unit' in attributes
  if (p.attributes && typeof p.attributes === "object") {
    for (const [k, v] of Object.entries(p.attributes)) {
      if (/unit/i.test(k) && typeof v === "string") {
        const res = checkValue(v);
        if (res !== null) return res;
      }
    }
  }

  // 6. Check product title/name for unit indicators
  const title = product.name?.toLowerCase() || "";
  if (/\b(dz|dozen|doz)\b/i.test(title)) return "DZ";
  if (/\b(pac|pack)\b/i.test(title)) return "PAC";
  if (/\b(pc|pcs)\b/i.test(title)) return "PC";
  const packMatch = title.match(/\b(box|set|bundle|pkt|packet|carton|pair)\b/i);
  if (packMatch) return packMatch[1].toUpperCase();

  return null;
}

export interface AvailableUnitOption {
  sku: string;
  label: string;
  skuObj: BackendSku;
}

/**
 * Returns list of distinct unit options if product offers variants (e.g. PC and DZ).
 */
export function getAvailableUnits(product: DisplayProduct): AvailableUnitOption[] {
  if (!product.skus || product.skus.length <= 1) return [];

  const list: AvailableUnitOption[] = [];
  const seen = new Set<string>();

  for (const s of product.skus) {
    const raw =
      (s as any).unitName ||
      (s as any).unit_name ||
      (s as any).unit ||
      s.attributes?.unitName ||
      s.attributes?.["Unit Name"] ||
      s.attributes?.unit_name ||
      s.attributes?.unit ||
      s.attributes?.Unit ||
      s.attributes?.format ||
      s.attributes?.Format ||
      s.sku;

    let label = String(raw).trim();
    if (label === "-" || label === "--" || label === "—") continue;

    const lower = label.toLowerCase();
    if (lower === "dz" || lower === "dozen" || lower === "doz") label = "DZ";
    else if (lower === "pac" || lower === "pack") label = "PAC";
    else if (lower === "pc" || lower === "piece" || lower === "pcs") label = "PC";
    else label = label.toUpperCase().replace(/^\/+\s*/, "");

    if (label === "-" || label === "--") continue;

    if (!seen.has(label)) {
      seen.add(label);
      list.push({ sku: s.sku, label, skuObj: s });
    }
  }

  return list.length > 1 ? list : [];
}
