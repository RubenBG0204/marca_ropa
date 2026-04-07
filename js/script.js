import { getProducts, filterProducts, getProductById, addProduct, updateProduct, deleteProduct } from "./products.js";
import { addToCart, cartCount, getCart, updateQty, removeItem, clearCart } from "./cart.js";
import { registerUser, login, getCurrentUser, logout } from "./users.js";
import { createOrder, getUserOrders } from "./orders.js";
import { initMenu, initLoader, initScrollReveal, initPageTransitions, initTiltEffects } from "./ui.js";
import { initRouter } from "./router.js";

// Global init
initMenu();
initLoader();
initScrollReveal();
initPageTransitions();
initTiltEffects();
initRouter();
updateCartBadge();

const page = document.body.dataset.page;

if (page === "shop") initShop();
if (page === "product") initProduct();
if (page === "cart") initCart();
if (page === "checkout") initCheckout();
if (page === "login") initLogin();
if (page === "register") initRegister();
if (page === "profile") initProfile();
if (page === "orders") initOrders();
if (page === "admin") initAdmin();
if (page === "contact") initContact();

function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = cartCount();
}

function renderProducts(container, products) {
  container.innerHTML = products.map((p) => `
    <article class="product-card">
      <div class="product-img ${p.image}"></div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">€${p.price}</p>
        <div class="card-actions">
          <a class="btn ghost" href="product.html?id=${p.id}">View</a>
          <button class="btn add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");

  container.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.id, 1);
      updateCartBadge();
    });
  });
}

function initShop() {
  const grid = document.getElementById("shopGrid");
  const search = document.getElementById("searchInput");
  const category = document.getElementById("categoryFilter");
  const price = document.getElementById("priceFilter");
  const sort = document.getElementById("sortFilter");

  const applyFilters = () => {
    const products = filterProducts({
      search: search.value,
      category: category.value,
      price: price.value,
      sort: sort.value
    });
    renderProducts(grid, products);
  };

  [search, category, price, sort].forEach((el) => el.addEventListener("input", applyFilters));
  applyFilters();
}

function initProduct() {
  const container = document.getElementById("productDetail");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "p1";
  const product = getProductById(id) || getProducts()[0];

  container.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-gallery">
        <div class="gallery-main ${product.image}"></div>
        <div class="gallery-thumbs">
          <div class="thumb ${product.image}"></div>
          <div class="thumb img-4"></div>
          <div class="thumb img-7"></div>
        </div>
      </div>
      <div class="card">
        <h1>${product.name}</h1>
        <p class="price">€${product.price}</p>
        <p class="muted">${product.description}</p>
        <div class="size-selector" id="sizeSelector">
          <button type="button">S</button>
          <button type="button">M</button>
          <button type="button">L</button>
          <button type="button">XL</button>
        </div>
        <div class="qty">
          <button type="button" id="qtyMinus">-</button>
          <span id="qtyValue">1</span>
          <button type="button" id="qtyPlus">+</button>
        </div>
        <button class="btn" id="addProduct">Add to Cart</button>
      </div>
    </div>
  `;

  let qty = 1;
  const qtyValue = document.getElementById("qtyValue");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyValue.textContent = qty;
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty += 1;
    qtyValue.textContent = qty;
  });
  document.getElementById("addProduct").addEventListener("click", () => {
    addToCart(product.id, qty);
    updateCartBadge();
  });

  const related = document.getElementById("relatedProducts");
  const products = getProducts().filter((p) => p.id !== product.id).slice(0, 4);
  renderProducts(related, products);
}

function initCart() {
  const itemsEl = document.getElementById("cartItems");
  const summaryEl = document.getElementById("cartSummary");
  const products = getProducts();
  const cart = getCart();

  if (cart.length === 0) {
    itemsEl.innerHTML = "<p class='muted'>Your cart is empty.</p>";
    summaryEl.innerHTML = "<p class='muted'>Add items to continue.</p>";
    return;
  }

  itemsEl.innerHTML = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return `
      <div class="cart-item card">
        <div class="product-img ${product.image}"></div>
        <div>
          <h3>${product.name}</h3>
          <p class="muted">€${product.price}</p>
          <div class="qty">
            <button data-action="minus" data-id="${product.id}">-</button>
            <span>${item.qty}</span>
            <button data-action="plus" data-id="${product.id}">+</button>
            <button data-action="remove" data-id="${product.id}" class="btn ghost">Remove</button>
          </div>
        </div>
        <strong>€${product.price * item.qty}</strong>
      </div>
    `;
  }).join("");

  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  summaryEl.innerHTML = `
    <h3>Summary</h3>
    <p>Total: <strong>€${total}</strong></p>
    <a class="btn" href="checkout.html">Checkout</a>
  `;

  itemsEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = cart.find((c) => c.id === id);
      if (action === "minus") updateQty(id, item.qty - 1);
      if (action === "plus") updateQty(id, item.qty + 1);
      if (action === "remove") removeItem(id);
      window.location.reload();
    });
  });
}

function initCheckout() {
  const summary = document.getElementById("checkoutSummary");
  const products = getProducts();
  const cart = getCart();
  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  summary.innerHTML = `
    <h3>Order Summary</h3>
    <p>Items: ${cartCount()}</p>
    <p>Total: <strong>€${total}</strong></p>
  `;

  const form = document.getElementById("checkoutForm");
  const success = document.getElementById("checkoutSuccess");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fullName");
    const email = document.getElementById("email");
    const address = document.getElementById("address");
    const card = document.getElementById("card");

    const valid = validateField(name, "nameError") &
      validateField(email, "emailError", true) &
      validateField(address, "addressError") &
      validateField(card, "cardError");

    if (!valid) return;

    const user = getCurrentUser();
    createOrder({
      id: `o${Date.now()}`,
      userId: user ? user.id : "guest",
      name: name.value,
      items: cart,
      total,
      date: new Date().toISOString()
    });
    clearCart();
    updateCartBadge();
    success.textContent = "Order placed! Confirmation sent to your email.";
    form.reset();
  });
}

function initLogin() {
  const form = document.getElementById("loginForm");
  const success = document.getElementById("loginSuccess");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const ok = validateField(email, "emailError", true) & validateField(password, "passwordError");
    if (!ok) return;
    const result = login(email.value, password.value);
    success.textContent = result.success ? "Login successful." : result.message;
  });
}

function initRegister() {
  const form = document.getElementById("registerForm");
  const success = document.getElementById("registerSuccess");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const ok = validateField(name, "nameError") & validateField(email, "emailError", true) & validateField(password, "passwordError");
    if (!ok) return;
    const result = registerUser({ name: name.value, email: email.value, password: password.value });
    success.textContent = result.success ? "Account created." : result.message;
  });
}

function initProfile() {
  const card = document.getElementById("profileCard");
  const user = getCurrentUser();
  if (!user) {
    card.innerHTML = "<p class='muted'>You are not logged in.</p><a class='btn' href='login.html'>Login</a>";
    return;
  }
  card.innerHTML = `
    <h2>${user.name}</h2>
    <p class="muted">${user.email}</p>
    <button class="btn ghost" id="logoutBtn">Logout</button>
  `;
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
    window.location.reload();
  });
}

function initOrders() {
  const list = document.getElementById("ordersList");
  const user = getCurrentUser();
  const orders = user ? getUserOrders(user.id) : [];
  if (!orders.length) {
    list.innerHTML = "<p class='muted'>No orders yet.</p>";
    return;
  }
  list.innerHTML = orders.map((o) => `
    <div class="order-card">
      <h3>Order ${o.id}</h3>
      <p class="muted">${new Date(o.date).toLocaleDateString()}</p>
      <p>Total: €${o.total}</p>
    </div>
  `).join("");
}

function initAdmin() {
  const list = document.getElementById("adminList");
  const form = document.getElementById("adminForm");
  const success = document.getElementById("adminSuccess");

  const render = () => {
    const products = getProducts();
    list.innerHTML = `
      <h3>Products</h3>
      <div class="admin-list">
        ${products.map((p) => `
          <div class="admin-item">
            <span>${p.name} - €${p.price}</span>
            <div>
              <button class="btn ghost" data-action="edit" data-id="${p.id}">Edit</button>
              <button class="btn ghost" data-action="delete" data-id="${p.id}">Delete</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    list.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        if (action === "delete") {
          deleteProduct(id);
          render();
        }
        if (action === "edit") {
          const product = getProductById(id);
          document.getElementById("productId").value = product.id;
          document.getElementById("productName").value = product.name;
          document.getElementById("productCategory").value = product.category;
          document.getElementById("productPrice").value = product.price;
          document.getElementById("productImage").value = product.image;
        }
      });
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("productId").value || `p${Date.now()}`;
    const name = document.getElementById("productName");
    const category = document.getElementById("productCategory");
    const price = document.getElementById("productPrice");
    const image = document.getElementById("productImage");

    const ok = validateField(name, "productNameError") & validateField(price, "productPriceError") & validateField(image, "productImageError");
    if (!ok) return;

    const product = { id, name: name.value, category: category.value, price: Number(price.value), image: image.value, description: "Custom product" };
    const exists = getProductById(id);
    if (exists) updateProduct(product); else addProduct(product);
    success.textContent = "Product saved.";
    form.reset();
    render();
  });

  render();
}

function initContact() {
  const form = document.getElementById("contactForm");
  const success = document.getElementById("contactSuccess");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const ok = validateField(name, "nameError") & validateField(email, "emailError", true) & validateField(message, "messageError");
    if (!ok) return;
    success.textContent = "Thanks! We will reply soon.";
    form.reset();
  });
}

function validateField(input, errorId, isEmail = false) {
  const error = document.getElementById(errorId);
  if (!input.value.trim()) {
    if (error) error.textContent = "Required.";
    return false;
  }
  if (isEmail) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(input.value)) {
      if (error) error.textContent = "Invalid email.";
      return false;
    }
  }
  if (error) error.textContent = "";
  return true;
}
