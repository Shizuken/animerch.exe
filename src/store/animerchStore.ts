import { useSyncExternalStore } from "react";
import { GALLERY, GalleryItem, PRODUCTS, Product } from "@/data/animerch";

type State = {
  products: Product[];
  gallery: GalleryItem[];
  featuredIds: (string | null)[]; // length 3
};

const LS_KEY = "animerch_db_v1";

function load(): State {
  if (typeof window === "undefined") return { products: PRODUCTS, gallery: GALLERY, featuredIds: [PRODUCTS[0]?.id ?? null, PRODUCTS[1]?.id ?? null, PRODUCTS[2]?.id ?? null] };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    products: PRODUCTS,
    gallery: GALLERY,
    featuredIds: [PRODUCTS[0]?.id ?? null, PRODUCTS[1]?.id ?? null, PRODUCTS[2]?.id ?? null],
  };
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

export const animerchStore = {
  getState: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setFeatured(ids: (string | null)[]) {
    state = { ...state, featuredIds: ids.slice(0, 3) };
    emit();
  },
  addProduct(p: Product) {
    state = { ...state, products: [p, ...state.products] };
    emit();
  },
  updateProduct(id: string, patch: Partial<Product>) {
    state = { ...state, products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
    emit();
  },
  removeProduct(id: string) {
    state = {
      ...state,
      products: state.products.filter((p) => p.id !== id),
      featuredIds: state.featuredIds.map((f) => (f === id ? null : f)),
    };
    emit();
  },
  addGallery(g: GalleryItem) {
    state = { ...state, gallery: [g, ...state.gallery] };
    emit();
  },
  updateGallery(id: string, patch: Partial<GalleryItem>) {
    state = { ...state, gallery: state.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)) };
    emit();
  },
  removeGallery(id: string) {
    state = { ...state, gallery: state.gallery.filter((g) => g.id !== id) };
    emit();
  },
  reset() {
    localStorage.removeItem(LS_KEY);
    state = load();
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