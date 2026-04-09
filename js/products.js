// Product data and helpers
const DEFAULT_PRODUCTS = [
  { id: "p1", name: "Camiseta Costura Contour", price: 42, category: "tshirts", image: "img-2", description: "Algodón transpirable con ajuste entallado." },
  { id: "p2", name: "Sudadera Airline Tech", price: 98, category: "hoodies", image: "img-1", description: "Felpa suave con capucha estructurada." },
  { id: "p3", name: "Pantalón Studio Taper", price: 76, category: "pants", image: "img-3", description: "Pierna entallada con elasticidad premium." },
  { id: "p4", name: "Gorra Aero", price: 28, category: "accessories", image: "img-8", description: "Bordado minimalista, tejido ligero." },
  { id: "p5", name: "Zapatilla Momentum", price: 120, category: "shoes", image: "img-9", description: "Suela amortiguada, lista para la ciudad." },
  { id: "p6", name: "Camiseta Soft Rib", price: 35, category: "tshirts", image: "img-5", description: "Textura acanalada sutil, fit slim." },
  { id: "p7", name: "Sudadera Cloud", price: 86, category: "hoodies", image: "img-6", description: "Ajuste relajado con interior perchado." },
  { id: "p8", name: "Pantalón Flow", price: 72, category: "pants", image: "img-7", description: "Caída fluida con acabado sastre." },
  { id: "p9", name: "Cinturón Signature", price: 26, category: "accessories", image: "img-4", description: "Hebilla mate, diseño minimalista." }
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
