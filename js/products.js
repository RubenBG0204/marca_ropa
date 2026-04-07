// Product data and helpers
const DEFAULT_PRODUCTS = [
  { id: "p1", name: "Contour Seam Tee", price: 42, category: "tshirts", image: "img-2", description: "Breathable cotton with a tailored fit." },
  { id: "p2", name: "Airline Tech Hoodie", price: 98, category: "hoodies", image: "img-1", description: "Soft fleece, structured hood." },
  { id: "p3", name: "Studio Taper Pant", price: 76, category: "pants", image: "img-3", description: "Tapered leg, premium stretch." },
  { id: "p4", name: "Aero Cap", price: 28, category: "accessories", image: "img-8", description: "Minimal embroidery, light fabric." },
  { id: "p5", name: "Momentum Sneaker", price: 120, category: "shoes", image: "img-9", description: "Cushioned sole, urban ready." },
  { id: "p6", name: "Soft Rib Tee", price: 35, category: "tshirts", image: "img-5", description: "Subtle rib texture, slim fit." },
  { id: "p7", name: "Cloud Hoodie", price: 86, category: "hoodies", image: "img-6", description: "Relaxed fit, brushed inside." },
  { id: "p8", name: "Flow Trousers", price: 72, category: "pants", image: "img-7", description: "Fluid drape with tailored finish." },
  { id: "p9", name: "Signature Belt", price: 26, category: "accessories", image: "img-4", description: "Matte buckle, minimalist design." }
];

const PRODUCT_KEY = "sigilious_products";

export function getProducts() {
  const stored = localStorage.getItem(PRODUCT_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id);
}

export function addProduct(product) {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(product) {
  const products = getProducts().map((p) => (p.id === product.id ? product : p));
  saveProducts(products);
}

export function deleteProduct(id) {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

export function filterProducts({ search = "", category = "all", price = "all", sort = "featured" }) {
  let items = [...getProducts()];

  if (search) {
    items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  if (category !== "all") {
    items = items.filter((p) => p.category === category);
  }

  if (price !== "all") {
    const [min, max] = price.split("-").map(Number);
    items = items.filter((p) => (max ? p.price >= min && p.price <= max : p.price < min));
  }

  if (sort === "low") items.sort((a, b) => a.price - b.price);
  if (sort === "high") items.sort((a, b) => b.price - a.price);
  if (sort === "name") items.sort((a, b) => a.name.localeCompare(b.name));

  return items;
}
