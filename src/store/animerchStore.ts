import { useSyncExternalStore } from "react";
import {
  Category,
  DEFAULT_GALLERY_CATEGORIES,
  DEFAULT_PRODUCT_CATEGORIES,
  GALLERY,
  GalleryItem,
  PRODUCTS,
  Product,
} from "@/data/animerch";

type State = {
  products: Product[];
  gallery: GalleryItem[];
  productCategories: Category[];
  galleryCategories: Category[];
  featured: (string | null)[]; // length 3
};

const LS_KEY = "animerch_data";

function seed(): State {
  return {
    productCategories: DEFAULT_PRODUCT_CATEGORIES,
    galleryCategories: DEFAULT_GALLERY_CATEGORIES,
    products: PRODUCTS,
    gallery: GALLERY,
    featured: [PRODUCTS[0]?.id ?? null, PRODUCTS[1]?.id ?? null, PRODUCTS[2]?.id ?? null],
  };
}

function load(): State {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Basic shape check; fall back to seed otherwise
      if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.productCategories)) {
        return {
          productCategories: parsed.productCategories ?? DEFAULT_PRODUCT_CATEGORIES,
          galleryCategories: parsed.galleryCategories ?? DEFAULT_GALLERY_CATEGORIES,
          products: parsed.products,
          gallery: parsed.gallery ?? [],
          featured: parsed.featured ?? [null, null, null],
        };
      }
    }
  } catch {}
  return seed();
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}
function emit() {
  persist();
  listeners.forEach((l) => l());
}
function update(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

export const animerchStore = {
  getState: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setFeatured(ids: (string | null)[]) {
    update({ featured: ids.slice(0, 3) });
  },
  // Products
  addProduct(p: Product) { update({ products: [p, ...state.products] }); },
  updateProduct(id: string, patch: Partial<Product>) {
    update({ products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  },
  removeProduct(id: string) {
    update({
      products: state.products.filter((p) => p.id !== id),
      featured: state.featured.map((f) => (f === id ? null : f)),
    });
  },
  // Gallery
  addGallery(g: GalleryItem) { update({ gallery: [g, ...state.gallery] }); },
  updateGallery(id: string, patch: Partial<GalleryItem>) {
    update({ gallery: state.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)) });
  },
  removeGallery(id: string) { update({ gallery: state.gallery.filter((g) => g.id !== id) }); },
  // Product categories
  addProductCategory(name: string): Category {
    const c = { id: `pcat_${Date.now()}`, name };
    update({ productCategories: [...state.productCategories, c] });
    return c;
  },
  renameProductCategory(id: string, name: string) {
    update({ productCategories: state.productCategories.map((c) => (c.id === id ? { ...c, name } : c)) });
  },
  removeProductCategory(id: string) {
    update({
      productCategories: state.productCategories.filter((c) => c.id !== id),
      products: state.products.map((p) => (p.category_id === id ? { ...p, category_id: null } : p)),
    });
  },
  // Gallery categories
  addGalleryCategory(name: string): Category {
    const c = { id: `gcat_${Date.now()}`, name };
    update({ galleryCategories: [...state.galleryCategories, c] });
    return c;
  },
  renameGalleryCategory(id: string, name: string) {
    update({ galleryCategories: state.galleryCategories.map((c) => (c.id === id ? { ...c, name } : c)) });
  },
  removeGalleryCategory(id: string) {
    update({
      galleryCategories: state.galleryCategories.filter((c) => c.id !== id),
      gallery: state.gallery.map((g) => (g.category_id === id ? { ...g, category_id: null } : g)),
    });
  },
  reset() {
    if (typeof window !== "undefined") localStorage.removeItem(LS_KEY);
    state = seed();
    emit();
  },
};

export function useAnimerchStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    animerchStore.subscribe,
    () => selector(animerchStore.getState()),
    () => selector(animerchStore.getState()),
  );
}

// Helpers
export function categoryName(cats: Category[], id: string | null | undefined): string {
  if (!id) return "Uncategorized";
  return cats.find((c) => c.id === id)?.name ?? "Uncategorized";
}
