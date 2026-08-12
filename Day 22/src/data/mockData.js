// Deterministic product generator for 1,000+ items dataset

const CATEGORIES = [
  "Electronics",
  "Audio & Sound",
  "Smart Home",
  "Gaming & VR",
  "Wearables",
  "Computer Hardware",
  "Mobile Accessories",
  "Networking & Storage"
];

const BRANDS = [
  "Apex", "CyberTech", "Nexus", "Vortex", "Hyperion", "Quantum", "Titan", "Aura", 
  "Zenith", "Spectra", "Pulse", "Omni", "Lumina", "Matrix", "Starlight", "Core"
];

const NOUNS = [
  "Pro Laptop", "Wireless Headphones", "Ultra Monitor", "Mechanical Keyboard",
  "Gaming Mouse", "Smart Watch", "Noise-Cancelling Earbuds", "SSD Drive 2TB",
  "Graphics Card RTX", "Smart Speaker", "4K Webcam", "VR Headset",
  "Power Bank 20k", "Wi-Fi 7 Router", "Ergonomic Chair", "USB-C Docking Hub",
  "Bluetooth Tracker", "Smart Thermostat", "OLED TV 55-inch", "Microphone Studio"
];

const TAG_POOL = [
  "Bestseller", "New", "Wireless", "RGB Lighting", "Noise Cancelling", 
  "4K Ultra HD", "Fast Charge", "Waterproof", "Sale", "Premium Build", "Eco Friendly"
];

// Helper to generate deterministic random values based on seed index
function pseudoRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateProducts(count = 1000) {
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const brand = BRANDS[Math.floor(pseudoRandom(i * 1) * BRANDS.length)];
    const noun = NOUNS[Math.floor(pseudoRandom(i * 2) * NOUNS.length)];
    const category = CATEGORIES[Math.floor(pseudoRandom(i * 3) * CATEGORIES.length)];
    
    // Price between $15.99 and $2499.99
    const rawPrice = 15 + pseudoRandom(i * 4) * 2484;
    const price = parseFloat(rawPrice.toFixed(2));
    
    // Rating between 2.5 and 5.0
    const rating = parseFloat((2.5 + pseudoRandom(i * 5) * 2.5).toFixed(1));
    
    // Stock between 0 and 350
    const stock = Math.floor(pseudoRandom(i * 6) * 350);
    
    // Sales count
    const salesCount = Math.floor(pseudoRandom(i * 7) * 8500) + 12;
    
    // Select 2 to 4 tags
    const tagCount = 2 + Math.floor(pseudoRandom(i * 8) * 3);
    const tags = [];
    for (let t = 0; t < tagCount; t++) {
      const tagIndex = Math.floor(pseudoRandom(i * 9 + t) * TAG_POOL.length);
      const tag = TAG_POOL[tagIndex];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }

    products.push({
      id: i,
      sku: `PROD-${10000 + i}`,
      name: `${brand} ${noun} v${(i % 5) + 1}`,
      category,
      price,
      rating,
      stock,
      salesCount,
      tags,
      isFavorite: i % 17 === 0, // initial sample favorites
      cartQuantity: 0,
      releaseYear: 2021 + (i % 5),
      specs: {
        weight: `${(0.2 + pseudoRandom(i * 10) * 4).toFixed(1)} kg`,
        warranty: `${1 + (i % 3)} Years`,
        power: `${10 + Math.floor(pseudoRandom(i * 11) * 90)}W`
      }
    });
  }

  return products;
}

export const CATEGORY_LIST = ["All Categories", ...CATEGORIES];
export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "sales-desc", label: "Best Sellers" },
  { value: "name-asc", label: "Name: A to Z" }
];
