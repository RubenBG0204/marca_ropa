// Orders logic
const ORDERS_KEY = "sigilious_orders";

export function getOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
}

export function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function createOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}

export function getUserOrders(userId) {
  return getOrders().filter((o) => o.userId === userId);
}
