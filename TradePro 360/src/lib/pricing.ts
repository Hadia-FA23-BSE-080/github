/**
 * UK trade parts pricing database (simulated local supplier prices).
 * In production, integrate with Screwfix, Toolstation, or Wolseley APIs.
 */

export interface PartPrice {
  sku: string;
  name: string;
  category: string;
  tradeType: "PLUMBER" | "ELECTRICIAN" | "CLEANER" | "ALL";
  unitPrice: number;
  unit: string;
}

const UK_PARTS_CATALOG: PartPrice[] = [
  // Plumbing
  { sku: "PL-001", name: "15mm Copper Pipe (3m)", category: "Pipework", tradeType: "PLUMBER", unitPrice: 12.49, unit: "each" },
  { sku: "PL-002", name: "Compression Tee 15mm", category: "Fittings", tradeType: "PLUMBER", unitPrice: 2.89, unit: "each" },
  { sku: "PL-003", name: "Basin Tap (Chrome)", category: "Taps", tradeType: "PLUMBER", unitPrice: 34.99, unit: "each" },
  { sku: "PL-004", name: "Worcester Bosch PCB", category: "Boiler Parts", tradeType: "PLUMBER", unitPrice: 189.00, unit: "each" },
  { sku: "PL-005", name: "Waste Trap 32mm", category: "Waste", tradeType: "PLUMBER", unitPrice: 4.50, unit: "each" },
  { sku: "PL-006", name: "PTFE Tape Roll", category: "Consumables", tradeType: "PLUMBER", unitPrice: 0.89, unit: "each" },
  { sku: "PL-007", name: "Radiator Valve (TRV)", category: "Heating", tradeType: "PLUMBER", unitPrice: 18.99, unit: "each" },
  { sku: "PL-008", name: "Immersion Heater 3kW", category: "Heating", tradeType: "PLUMBER", unitPrice: 24.50, unit: "each" },

  // Electrical
  { sku: "EL-001", name: "13A Double Socket (White)", category: "Sockets", tradeType: "ELECTRICIAN", unitPrice: 3.49, unit: "each" },
  { sku: "EL-002", name: "Consumer Unit 10-Way", category: "Distribution", tradeType: "ELECTRICIAN", unitPrice: 89.99, unit: "each" },
  { sku: "EL-003", name: "2.5mm T&E Cable (50m)", category: "Cable", tradeType: "ELECTRICIAN", unitPrice: 62.00, unit: "roll" },
  { sku: "EL-004", name: "RCD Breaker 32A", category: "Protection", tradeType: "ELECTRICIAN", unitPrice: 28.50, unit: "each" },
  { sku: "EL-005", name: "LED Downlight 5W", category: "Lighting", tradeType: "ELECTRICIAN", unitPrice: 6.99, unit: "each" },
  { sku: "EL-006", name: "Smoke Alarm (Mains)", category: "Safety", tradeType: "ELECTRICIAN", unitPrice: 15.99, unit: "each" },
  { sku: "EL-007", name: "Junction Box 30A", category: "Accessories", tradeType: "ELECTRICIAN", unitPrice: 1.89, unit: "each" },

  // Cleaning
  { sku: "CL-001", name: "Industrial Degreaser (5L)", category: "Chemicals", tradeType: "CLEANER", unitPrice: 18.99, unit: "each" },
  { sku: "CL-002", name: "Microfibre Cloths (Pack 10)", category: "Supplies", tradeType: "CLEANER", unitPrice: 8.50, unit: "pack" },
  { sku: "CL-003", name: "HEPA Vacuum Bags (Pack 5)", category: "Equipment", tradeType: "CLEANER", unitPrice: 12.00, unit: "pack" },
  { sku: "CL-004", name: "Carpet Shampoo (2L)", category: "Chemicals", tradeType: "CLEANER", unitPrice: 14.99, unit: "each" },

  // Universal
  { sku: "UN-001", name: "Standard Callout Materials Kit", category: "General", tradeType: "ALL", unitPrice: 15.00, unit: "kit" },
];

export interface QuoteLineItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface QuoteResult {
  labourHours: number;
  labourRate: number;
  labourCost: number;
  calloutFee: number;
  parts: QuoteLineItem[];
  partsCost: number;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

const KEYWORD_PARTS: Record<string, Record<string, string[]>> = {
  PLUMBER: {
    tap: ["PL-003", "PL-006"],
    leak: ["PL-001", "PL-002", "PL-006"],
    boiler: ["PL-004", "PL-007"],
    radiator: ["PL-007", "PL-001"],
    pipe: ["PL-001", "PL-002", "PL-006"],
    drain: ["PL-005"],
    immersion: ["PL-008"],
  },
  ELECTRICIAN: {
    socket: ["EL-001", "EL-007"],
    fuse: ["EL-004", "EL-002"],
    consumer: ["EL-002", "EL-004"],
    light: ["EL-005", "EL-007"],
    wiring: ["EL-003", "EL-007"],
    smoke: ["EL-006"],
    cable: ["EL-003"],
  },
  CLEANER: {
    deep: ["CL-001", "CL-002", "CL-004"],
    carpet: ["CL-004", "CL-003"],
    office: ["CL-001", "CL-002"],
    end: ["CL-001", "CL-002", "CL-004"],
  },
};

function detectPartsFromDescription(
  description: string,
  tradeType: "PLUMBER" | "ELECTRICIAN" | "CLEANER"
): string[] {
  const lower = description.toLowerCase();
  const keywords = KEYWORD_PARTS[tradeType] ?? {};
  const skus = new Set<string>();

  for (const [keyword, parts] of Object.entries(keywords)) {
    if (lower.includes(keyword)) {
      parts.forEach((sku) => skus.add(sku));
    }
  }

  if (skus.size === 0) {
    skus.add("UN-001");
  }

  return Array.from(skus);
}

function estimateLabourHours(description: string, tradeType: string): number {
  const lower = description.toLowerCase();
  if (lower.includes("emergency") || lower.includes("urgent")) return 2;
  if (lower.includes("install") || lower.includes("replacement")) return 3;
  if (lower.includes("repair") || lower.includes("fix")) return 1.5;
  if (tradeType === "CLEANER") return 2;
  return 1;
}

export function calculateQuote(
  description: string,
  tradeType: "PLUMBER" | "ELECTRICIAN" | "CLEANER",
  hourlyRate: number,
  calloutFee: number,
  vatRate = 0.2
): QuoteResult {
  const labourHours = estimateLabourHours(description, tradeType);
  const labourCost = labourHours * hourlyRate;

  const partSkus = detectPartsFromDescription(description, tradeType);
  const parts: QuoteLineItem[] = partSkus.map((sku) => {
    const part = UK_PARTS_CATALOG.find((p) => p.sku === sku)!;
    return {
      sku: part.sku,
      name: part.name,
      quantity: 1,
      unitPrice: part.unitPrice,
      totalPrice: part.unitPrice,
    };
  });

  const partsCost = parts.reduce((sum, p) => sum + p.totalPrice, 0);
  const subtotal = labourCost + calloutFee + partsCost;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  return {
    labourHours,
    labourRate: hourlyRate,
    labourCost,
    calloutFee,
    parts,
    partsCost,
    subtotal,
    vatRate,
    vatAmount,
    total,
  };
}

export function searchParts(
  query: string,
  tradeType?: "PLUMBER" | "ELECTRICIAN" | "CLEANER"
): PartPrice[] {
  const lower = query.toLowerCase();
  return UK_PARTS_CATALOG.filter((p) => {
    const matchesTrade =
      !tradeType || p.tradeType === tradeType || p.tradeType === "ALL";
    const matchesQuery =
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.sku.toLowerCase().includes(lower);
    return matchesTrade && matchesQuery;
  });
}

export function getAllParts(
  tradeType?: "PLUMBER" | "ELECTRICIAN" | "CLEANER"
): PartPrice[] {
  if (!tradeType) return UK_PARTS_CATALOG;
  return UK_PARTS_CATALOG.filter(
    (p) => p.tradeType === tradeType || p.tradeType === "ALL"
  );
}
