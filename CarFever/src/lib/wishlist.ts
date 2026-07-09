export function getWishlist(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("cf_wishlist");
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function addToWishlist(carId: number): void {
  if (typeof window === "undefined") return;
  try {
    const wishlist = getWishlist();
    if (!wishlist.includes(carId)) {
      wishlist.push(carId);
      localStorage.setItem("cf_wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new CustomEvent("wishlist-updated"));
    }
  } catch (e) {
    console.error("Error adding to wishlist", e);
  }
}

export function removeFromWishlist(carId: number): void {
  if (typeof window === "undefined") return;
  try {
    const wishlist = getWishlist();
    const updated = wishlist.filter((id) => id !== carId);
    localStorage.setItem("cf_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  } catch (e) {
    console.error("Error removing from wishlist", e);
  }
}

export function isInWishlist(carId: number): boolean {
  if (typeof window === "undefined") return false;
  return getWishlist().includes(carId);
}

export function getWishlistCount(): number {
  return getWishlist().length;
}
