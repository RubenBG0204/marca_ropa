// Cart logic
const CART_KEY = "sigilious_cart";

export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find((c) => c.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
}

export function updateQty(id, qty) {
  const cart = getCart().map((c) => (c.id === id ? { ...c, qty } : c));
  saveCart(cart.filter((c) => c.qty > 0));
}

export function removeItem(id) {
  saveCart(getCart().filter((c) => c.id !== id));
}

export function clearCart() {
  saveCart([]);
}

export function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
