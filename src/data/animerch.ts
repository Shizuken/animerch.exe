export type Category = { id: string; name: string };

export type Product = {
  id: string;
  name: string;
  category_id: string | null;
  price: number; // IDR
  badge?: "NEW" | "HOT";
  image: string;
  imageBg: string;
  emoji: string;
  dims: { l: number; w: number; h: number };
  weight: number;
  description: string;
  buyUrl: string;
};

export type GalleryItem = {
  id: string;
  name: string;
  category_id: string | null;
  date: string; // YYYY-MM
  description: string;
  image?: string;
  bg: string;
  emoji: string;
  height: number;
};

export const DEFAULT_PRODUCT_CATEGORIES: Category[] = [
  { id: "pcat_keychain", name: "Keychain" },
  { id: "pcat_plushie", name: "Plushie" },
  { id: "pcat_poster", name: "Poster" },
  { id: "pcat_apparel", name: "Apparel" },
  { id: "pcat_acrylic", name: "Acrylic Stand" },
];

export const DEFAULT_GALLERY_CATEGORIES: Category[] = [
  { id: "gcat_original", name: "Original" },
  { id: "gcat_demonslayer", name: "Demon Slayer" },
  { id: "gcat_onepiece", name: "One Piece" },
];

export const PRODUCTS: Product[] = [
  { id: "p1", name: "CHIBI CLOUD PLUSH", category_id: "pcat_plushie", price: 240000, badge: "NEW",
    image: "", imageBg: "#ffcde8", emoji: "🐰", dims: { l: 18, w: 14, h: 22 }, weight: 180,
    description: "A super-soft chibi bunny floating on a cloud cushion. Squish-tested by 1,000 cloud sprites.",
    buyUrl: "https://example.com/buy/chibi-cloud-plush" },
  { id: "p2", name: "STAR ACRYLIC STAND", category_id: "pcat_acrylic", price: 120000,
    image: "", imageBg: "#ffe76a", emoji: "⭐", dims: { l: 10, w: 4, h: 14 }, weight: 60,
    description: "Holographic acrylic stand with double-sided print. Perfect altar mate for your desk shrine.",
    buyUrl: "https://example.com/buy/star-stand" },
  { id: "p3", name: "PIXEL POSTER A2", category_id: "pcat_poster", price: 180000, badge: "HOT",
    image: "", imageBg: "#89c4f4", emoji: "🌸", dims: { l: 42, w: 1, h: 59.4 }, weight: 90,
    description: "Premium matte A2 poster, printed on 250gsm paper. Hand-rolled and shipped in a sturdy tube.",
    buyUrl: "https://example.com/buy/pixel-poster" },
  { id: "p4", name: "MOCHI KEYCHAIN", category_id: "pcat_keychain", price: 80000,
    image: "", imageBg: "#ffcde8", emoji: "🍡", dims: { l: 5, w: 2, h: 7 }, weight: 25,
    description: "Squishy mochi-style keychain with metal clasp. Smells faintly of strawberry. Maybe.",
    buyUrl: "https://example.com/buy/mochi-keychain" },
  { id: "p5", name: "SKY KINGDOM TEE", category_id: "pcat_apparel", price: 380000, badge: "NEW",
    image: "", imageBg: "#ddf0ff", emoji: "👕", dims: { l: 70, w: 50, h: 1 }, weight: 220,
    description: "100% combed cotton tee with embroidered cloud island crest. Unisex fit, sizes XS–XXL.",
    buyUrl: "https://example.com/buy/sky-tee" },
  { id: "p6", name: "MAGIC GIRL POSTER", category_id: "pcat_poster", price: 150000,
    image: "", imageBg: "#ffe76a", emoji: "✨", dims: { l: 42, w: 1, h: 59.4 }, weight: 85,
    description: "Pastel risograph-style print of an original magical girl, signed by the artist on the back.",
    buyUrl: "https://example.com/buy/magic-poster" },
  { id: "p7", name: "STARFISH PLUSHIE", category_id: "pcat_plushie", price: 220000, badge: "HOT",
    image: "", imageBg: "#89c4f4", emoji: "🌟", dims: { l: 22, w: 22, h: 8 }, weight: 160,
    description: "Fluffy starfish friend who blinks when squeezed (not really, but he is very supportive).",
    buyUrl: "https://example.com/buy/starfish" },
  { id: "p8", name: "RAINBOW KEYCHAIN", category_id: "pcat_keychain", price: 90000,
    image: "", imageBg: "#ffcde8", emoji: "🌈", dims: { l: 6, w: 1, h: 4 }, weight: 18,
    description: "Holographic charm with rainbow tassel. Makes any bag 200% cuter, scientifically proven.",
    buyUrl: "https://example.com/buy/rainbow-keychain" },
  { id: "p9", name: "CLOUD HOODIE", category_id: "pcat_apparel", price: 580000,
    image: "", imageBg: "#ddf0ff", emoji: "☁️", dims: { l: 72, w: 56, h: 2 }, weight: 540,
    description: "Cozy oversized hoodie in cloud-soft fleece, with embroidered ☁️ on the chest pocket.",
    buyUrl: "https://example.com/buy/cloud-hoodie" },
];

export const GALLERY: GalleryItem[] = [
  { id: "g1", name: "Sky Bunny No.1", category_id: "gcat_original", date: "2026-04", description: "First piece in the Cloud Bunny series.", bg: "#ffcde8", emoji: "🐰", height: 260 },
  { id: "g2", name: "Pixel Sword",    category_id: "gcat_original", date: "2026-03", description: "Handcrafted 32x32 pixel sword study. +5 cuteness.", bg: "#ffe76a", emoji: "⚔️", height: 200 },
  { id: "g3", name: "Mochi Squad",    category_id: "gcat_original", date: "2026-02", description: "Three mochi friends ready to roll into your heart.", bg: "#89c4f4", emoji: "🍡", height: 320 },
  { id: "g4", name: "Cloud Castle",   category_id: "gcat_original", date: "2026-01", description: "The animerch.exe HQ — a floating castle stitched from clouds.", bg: "#ddf0ff", emoji: "🏰", height: 280 },
  { id: "g5", name: "Star Familiar",  category_id: "gcat_original", date: "2025-12", description: "A tiny star spirit who follows you through every dungeon.", bg: "#ffe76a", emoji: "⭐", height: 240 },
  { id: "g6", name: "Magic Girl",     category_id: "gcat_original", date: "2025-11", description: "Transformation pose, frame 04. Sparkles added in post.", bg: "#ffcde8", emoji: "✨", height: 340 },
  { id: "g7", name: "Sleepy Slime",   category_id: "gcat_original", date: "2025-10", description: "He just wants a nap. Let him.", bg: "#89c4f4", emoji: "💤", height: 220 },
  { id: "g8", name: "Rainbow Road",   category_id: "gcat_original", date: "2025-09", description: "Tiny isometric path connecting the cloud islands.", bg: "#ddf0ff", emoji: "🌈", height: 300 },
  { id: "g9", name: "Pixel Cat",      category_id: "gcat_original", date: "2025-08", description: "Companion sprite. Knows three spells, all of them are 'meow'.", bg: "#ffcde8", emoji: "🐱", height: 250 },
];

export function formatIDR(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}
