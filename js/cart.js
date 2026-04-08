// Cart logic
const CART_KEY = "sigilious_cart";

function normalizeSize(size) {
  return typeof size === "string" ? size.trim().toUpperCase() : "";
}

function normalizeCart(cart) {
  return (Array.isArray(cart) ? cart : [])
    .map((item) => ({
      id: item.id,
      qty: Number(item.qty) || 0,
      size: normalizeSize(item.size)
    }))
    .filter((item) => item.id && item.qty > 0);
}

export function getCart() {
  return normalizeCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(normalizeCart(cart)));
}

export function addToCart(id, qty = 1, size = "") {
  const normalizedSize = normalizeSize(size);
  const amount = Number(qty) || 1;
  const cart = getCart();
  const item = cart.find((entry) => entry.id === id && entry.size === normalizedSize);

  if (item) item.qty += amount;
  else cart.push({ id, qty: amount, size: normalizedSize });

  saveCart(cart);
}

export function updateQty(id, size, qty) {
  const normalizedSize = normalizeSize(size);
  const cart = getCart().map((item) => (
    item.id === id && item.size === normalizedSize
      ? { ...item, qty: Number(qty) || 0 }
      : item
  ));

  saveCart(cart.filter((item) => item.qty > 0));
}

export function removeItem(id, size) {
  const normalizedSize = normalizeSize(size);
  saveCart(getCart().filter((item) => !(item.id === id && item.size === normalizedSize)));
}

export function clearCart() {
  saveCart([]);
}

export function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
