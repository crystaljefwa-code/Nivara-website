const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "×" : "☰";
  });
}

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    if (toggle) toggle.textContent = "☰";
  });
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* Newsletter demo only: this does not save email addresses. */
const form = document.getElementById("newsletter-form");
const message = document.getElementById("form-message");

if (form && message) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    message.textContent =
      "Thank you for your interest. Newsletter sign-up will be connected soon.";
    form.reset();
  });
}

/* NIVARA PHASE 1 CART
   Demo product is disabled until real scent details are added. */
const products = [
  {
    id: "preview-01",
    name: "Placeholder Scent 01",
    description: "A preview of a future Nivara fragrance. Final scent details coming soon."
  },
  {
    id: "preview-02",
    name: "Placeholder Scent 02",
    description: "A preview of a future Nivara fragrance. Final scent details coming soon."
  },
  {
    id: "preview-03",
    name: "Placeholder Scent 03",
    description: "A preview of a future Nivara fragrance. Final scent details coming soon."
  }
];

const cartKey = "nivara-cart-v1";
let cart = [];


try {
  cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

// Repair any older cart entries with missing or incorrect prices.
cart = cart
  .filter(item => item && item.key && item.name)
  .map(item => {
    const finish = item.finish === "Pearl" ? "Pearl" : "Classic";

    return {
      ...item,
      finish,
      price: finish === "Pearl" ? 650 : 600,
      quantity:
        Number.isInteger(item.quantity) && item.quantity > 0
          ? item.quantity
          : 1
    };
  });

const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const continueShopping = document.getElementById("continue-shopping");

const money = amount =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(amount);

function saveCart() {
  try {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch {
    /* The cart will still work until the page is refreshed. */
  }
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartCount) cartCount.textContent = count;
  if (cartTotal) cartTotal.textContent = money(total);
  if (!cartItems) return;

  cartItems.replaceChildren();

  if (!cart.length) {
    const empty = document.createElement("p");
    empty.textContent = "Your shopping bag is empty.";
    cartItems.appendChild(empty);
    return;
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = item.name;

    const variant = document.createElement("small");
    variant.textContent = `${item.finish} · ${money(item.price)} each`;

    details.append(name, variant);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Remove one ${item.name}`);
    minus.addEventListener("click", () => changeQuantity(item.key, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Add one ${item.name}`);
    plus.addEventListener("click", () => changeQuantity(item.key, 1));

    controls.append(minus, quantity, plus);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      cart = cart.filter(entry => entry.key !== item.key);
      saveCart();
      renderCart();
    });

    row.append(details, controls, remove);
    cartItems.appendChild(row);
  });
}

function changeQuantity(key, amount) {
  const item = cart.find(entry => entry.key === key);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(entry => entry.key !== key);
  }

  saveCart();
  renderCart();
}

function addToCart(product, finish) {
  const price = finish === "Pearl" ? 650 : 600;
  const key = `${product.id}-${finish}`;
  const existing = cart.find(item => item.key === key);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      finish,
      price,
      quantity: 1
    });
  }

  saveCart();
  renderCart();

  if (cartPanel) cartPanel.hidden = false;
}

cartToggle?.addEventListener("click", () => {
  if (cartPanel) cartPanel.hidden = !cartPanel.hidden;
});

cartClose?.addEventListener("click", () => {
  if (cartPanel) cartPanel.hidden = true;
});

continueShopping?.addEventListener("click", () => {
  if (cartPanel) cartPanel.hidden = true;
});

renderCart();

/* Product rendering will be enabled when real scent products are added.
   Example finish options: Classic KES 600 / Pearl KES 650. */

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  // Temporary artwork until real product photos are ready.
  const art = document.createElement("div");
  art.className = "product-art";

  const monogram = document.createElement("span");
  monogram.className = "product-monogram";
  monogram.textContent = "N.";

  const artNote = document.createElement("span");
  artNote.className = "product-art-note";
  artNote.textContent = "PREVIEW PRODUCT";

  art.append(monogram, artNote);

  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = "NIVARA FRAGRANCE · PREVIEW";

  const name = document.createElement("h3");
  name.textContent = product.name;

  const description = document.createElement("p");
  description.textContent = product.description;

  const select = document.createElement("select");
  select.className = "finish-select";
  select.setAttribute(
    "aria-label",
    `Choose finish for ${product.name}`
  );

  [
    { label: "Classic — KES 600", value: "Classic" },
    { label: "Pearl — KES 650", value: "Pearl" }
  ].forEach(item => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  });

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = "KES 600";

  select.addEventListener("change", () => {
    price.textContent =
      select.value === "Pearl" ? "KES 650" : "KES 600";
  });

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button-gold";
  button.textContent = "Add preview to bag";

  button.addEventListener("click", () => {
    addToCart(product, select.value);
  });

  const note = document.createElement("p");
  note.className = "product-note";
  note.textContent =
    "Demonstration only — final fragrance details coming soon.";

  info.append(category, name, description, select, price, button, note);
  card.append(art, info);

  return card;
}

// Display all temporary products in the shop.
const productGrid = document.getElementById("product-grid");

if (productGrid) {
  productGrid.replaceChildren();

  products.forEach(product => {
    productGrid.appendChild(createProductCard(product));
  });
}

/* NIVARA DELIVERY ESTIMATOR
   Shows proposed rates only; it does not book a carrier or take payment. */

const deliveryMethod = document.getElementById("delivery-method");
const deliveryDestination = document.getElementById("delivery-destination");
const destinationField = document.getElementById("destination-field");
const townField = document.getElementById("town-field");
const deliveryTown = document.getElementById("delivery-town");
const deliveryResult = document.getElementById("delivery-result");

function updateDeliveryEstimate() {
  if (!deliveryMethod || !deliveryResult) return;

  const isCountyDelivery = deliveryMethod.value === "county";

  if (destinationField) destinationField.hidden = !isCountyDelivery;
  if (townField) townField.hidden = !isCountyDelivery;

  if (!isCountyDelivery) {
    deliveryResult.textContent =
      "Free collection from Nivara’s designated Nairobi pickup point.";
    return;
  }

  const selected = deliveryDestination?.value || "";

  if (!selected) {
    deliveryResult.textContent =
      "Select an available county or destination to view the proposed delivery fee.";
    return;
  }

  const [fee, destination] = selected.split("|");
  const town = deliveryTown?.value.trim();
  const amount = Number(fee);

  deliveryResult.textContent =
    `Proposed delivery fee: KES ${amount.toLocaleString("en-KE")} for ${destination} County.` +
    (town
      ? ` Destination entered: ${town}.`
      : " Enter your destination town or parcel terminal above.") +
    " Route availability and the final fee must be confirmed before payment.";
}

deliveryMethod?.addEventListener("change", updateDeliveryEstimate);
deliveryDestination?.addEventListener("change", updateDeliveryEstimate);
deliveryTown?.addEventListener("input", updateDeliveryEstimate);

updateDeliveryEstimate();

