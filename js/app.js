import { fetchCategories, fetchProducts } from "./api.js";
import { clearSavedData, getCart, getPreferences, getTheme, getWishlist, saveCart, savePreferences, saveTheme, saveWishlist } from "./storage.js";

const $ = (selector) => document.querySelector(selector);
const elements = { grid: $("#productGrid"), search: $("#searchInput"), mobileSearch: $("#mobileSearchInput"), sort: $("#sortSelect"), tabs: $("#categoryTabs"), resultCount: $("#resultCount"), resultChip: $("#resultChipCount"), empty: $("#emptyState"), clearFilters: $("#clearFiltersBtn"), error: $("#errorBanner"), errorMessage: $("#errorMessage"), retry: $("#retryBtn"), refresh: $("#refreshBtn"), clearCache: $("#clearCacheBtn"), wishlistBtn: $("#wishlistBtn"), wishlistFilter: $("#wishlistFilterBtn"), wishlistCount: $("#wishlistCount"), wishlistFilterCount: $("#wishlistFilterCount"), cartCount: $("#cartCount"), cartOpen: $("#cartOpenBtn"), cartClose: $("#cartCloseBtn"), cartOverlay: $("#cartOverlay"), cartDrawer: $("#cartDrawer"), cartItems: $("#cartItems"), cartEmpty: $("#cartEmpty"), cartTotal: $("#cartTotal"), checkout: $("#checkoutBtn"), toast: $("#toast"), themeBtn: $("#themeBtn"), modal: $("#productModal"), modalOverlay: $("#modalOverlay"), modalClose: $("#modalClose"), modalContent: $("#modalContent"), heroProducts: $("#heroProductCount"), heroCategories: $("#heroCategoryCount"), promoAction: $("#promoAction"), backTop: $("#backTop") };

const state = { products: [], filtered: [], categories: [], category: "all", query: "", sort: "default", cart: getCart(), wishlist: getWishlist(), wishlistOnly: false };
let searchTimer;
let lastFocus = null;
let modalLastFocus = null;

const formatCategory = (value) => value.replace(/(^|[\s-])\w/g, (m) => m.toUpperCase());
const currency = (value) => `$${Number(value).toFixed(2)}`;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
const isWishlisted = (id) => state.wishlist.includes(Number(id));

function toast(message) { elements.toast.textContent = message; elements.toast.classList.add("show"); clearTimeout(toast.timer); toast.timer = setTimeout(() => elements.toast.classList.remove("show"), 2400); }
function showSkeletons() { elements.grid.innerHTML = Array.from({ length: 8 }, () => `<article class="skeleton"><div class="skeleton-image"></div><div class="skeleton-body"><i></i><i></i><i></i></div></article>`).join(""); elements.empty.hidden = true; }
function error(message) { elements.errorMessage.textContent = message; elements.error.hidden = false; }
function hideError() { elements.error.hidden = true; }

function renderCategories() {
  elements.tabs.innerHTML = state.categories.map((category) => `<button class="tab ${state.category === category ? "active" : ""}" data-category="${escapeHtml(category)}" role="tab" aria-selected="${state.category === category}" type="button">${category === "all" ? "All" : escapeHtml(formatCategory(category))}</button>`).join("");
}

function filterProducts() {
  const q = state.query.trim().toLowerCase();
  const list = state.products.filter((product) => {
    const matchesQuery = !q || `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(q);
    const matchesCategory = state.category === "all" || product.category === state.category;
    const matchesWish = !state.wishlistOnly || isWishlisted(product.id);
    return matchesQuery && matchesCategory && matchesWish;
  });
  list.sort((a, b) => ({ "price-asc": a.price - b.price, "price-desc": b.price - a.price, "rating-desc": b.rating - a.rating, "name-asc": a.title.localeCompare(b.title), "name-desc": b.title.localeCompare(a.title) }[state.sort] ?? 0));
  state.filtered = list;
}

function renderProducts() {
  elements.grid.innerHTML = state.filtered.map((p) => `<article class="product-card"><div class="product-image-wrap"><button class="heart-btn ${isWishlisted(p.id) ? "liked" : ""}" data-wish="${p.id}" type="button" aria-label="${isWishlisted(p.id) ? "Remove from" : "Add to"} wishlist">${isWishlisted(p.id) ? "♥" : "♡"}</button><img class="product-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy"></div><div class="product-info"><span class="product-category">${escapeHtml(formatCategory(p.category))}</span><h3 class="product-title" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</h3><div class="product-meta"><span class="rating">★ ${p.rating.toFixed(1)}</span><span>${p.ratingCount || 0} ratings</span></div><div class="product-bottom"><strong class="price">${currency(p.price)}</strong><div class="card-actions"><button class="view-btn" data-view="${p.id}" type="button">Details</button><button class="add-btn" data-add="${p.id}" type="button">Add</button></div></div></div></article>`).join("");
  const count = state.filtered.length; elements.resultCount.textContent = `${count} product${count === 1 ? "" : "s"} shown${state.wishlistOnly ? " in wishlist" : ""}`; elements.resultChip.textContent = count; elements.empty.hidden = count > 0;
}

function render() { filterProducts(); renderCategories(); renderProducts(); savePreferences({ category: state.category, query: state.query, sort: state.sort, wishlistOnly: state.wishlistOnly }); }
function syncSearch(value) { elements.search.value = value; elements.mobileSearch.value = value; }
function updateCounts() { const count = state.cart.reduce((sum, item) => sum + item.quantity, 0); elements.cartCount.textContent = count; elements.wishlistCount.textContent = state.wishlist.length; elements.wishlistFilterCount.textContent = state.wishlist.length; saveCart(state.cart); saveWishlist(state.wishlist); }

function addToCart(id) { const p = state.products.find((item) => String(item.id) === String(id)); if (!p) return; const item = state.cart.find((x) => x.id === p.id); item ? item.quantity++ : state.cart.push({ id: p.id, title: p.title, price: p.price, image: p.image, quantity: 1 }); updateCounts(); renderCart(); toast(`${p.title.slice(0, 30)} added to cart`); }
function changeQuantity(id, delta) { const item = state.cart.find((x) => String(x.id) === String(id)); if (!item) return; item.quantity += delta; if (item.quantity <= 0) state.cart = state.cart.filter((x) => x.id !== item.id); updateCounts(); renderCart(); }
function removeCart(id) { state.cart = state.cart.filter((x) => String(x.id) !== String(id)); updateCounts(); renderCart(); toast("Item removed from cart"); }
function renderCart() { const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0); elements.cartTotal.textContent = currency(total); elements.cartEmpty.hidden = state.cart.length > 0; elements.cartItems.hidden = state.cart.length === 0; elements.checkout.disabled = state.cart.length === 0; elements.cartItems.innerHTML = state.cart.map((item) => `<article class="cart-item"><img src="${escapeHtml(item.image)}" alt="" class="cart-thumb"><div class="cart-item-info"><h3>${escapeHtml(item.title)}</h3><span>${currency(item.price)} each</span></div><div class="cart-item-controls"><div class="quantity-controls"><button data-qty="${item.id}" data-delta="-1" type="button" aria-label="Decrease quantity">−</button><b>${item.quantity}</b><button data-qty="${item.id}" data-delta="1" type="button" aria-label="Increase quantity">+</button></div><button class="remove-btn" data-remove="${item.id}" type="button">Remove</button></div></article>`).join(""); }

function toggleWishlist(id) { const n = Number(id); state.wishlist = isWishlisted(n) ? state.wishlist.filter((x) => x !== n) : [...state.wishlist, n]; updateCounts(); render(); toast(isWishlisted(n) ? "Added to wishlist" : "Removed from wishlist"); }
function openCart() { lastFocus = document.activeElement; elements.cartDrawer.classList.add("is-open"); elements.cartDrawer.setAttribute("aria-hidden", "false"); elements.cartOpen.setAttribute("aria-expanded", "true"); document.body.classList.add("no-scroll"); elements.cartClose.focus(); }
function closeCart() { elements.cartDrawer.classList.remove("is-open"); elements.cartDrawer.setAttribute("aria-hidden", "true"); elements.cartOpen.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); lastFocus?.focus(); }

function openModal(id) { const p = state.products.find((x) => String(x.id) === String(id)); if (!p) return; modalLastFocus = document.activeElement; elements.modalContent.innerHTML = `<div class="modal-product"><div class="modal-image"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}"></div><div class="modal-copy"><span class="product-category">${escapeHtml(formatCategory(p.category))}</span><h2 id="modalTitle">${escapeHtml(p.title)}</h2><div class="modal-rating">★ ${p.rating.toFixed(1)} <span>(${p.ratingCount || 0} ratings)</span></div><p>${escapeHtml(p.description)}</p><div class="modal-price">${currency(p.price)}</div><div class="modal-actions"><button class="primary-cta" data-modal-add="${p.id}" type="button">Add to cart</button><button class="secondary-action" data-modal-wish="${p.id}" type="button">${isWishlisted(p.id) ? "♥ Wishlisted" : "♡ Add to wishlist"}</button></div></div></div>`; elements.modal.classList.add("is-open"); elements.modal.setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll"); elements.modalClose.focus(); }
function closeModal() { elements.modal.classList.remove("is-open"); elements.modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll"); modalLastFocus?.focus(); }

async function loadProducts() { hideError(); showSkeletons(); elements.resultCount.textContent = "Loading products..."; try { const [productsResult, categoriesResult] = await Promise.allSettled([fetchProducts(), fetchCategories()]); if (productsResult.status === "rejected") throw productsResult.reason; state.products = productsResult.value; const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : state.products.map((p) => p.category); state.categories = ["all", ...new Set(categories)]; elements.heroProducts.textContent = state.products.length; elements.heroCategories.textContent = state.categories.length - 1; render(); } catch (e) { console.error(e); elements.grid.innerHTML = ""; elements.resultCount.textContent = "Products unavailable"; error("Couldn't load products. Check your connection and use Retry to try again."); } finally { /* loading UI replaced in success/error */ } }
function setQuery(value) { state.query = value; syncSearch(value); clearTimeout(searchTimer); searchTimer = setTimeout(render, 280); }
function restore() { const p = getPreferences(); state.category = p.category || "all"; state.query = p.query || ""; state.sort = p.sort || "default"; state.wishlistOnly = Boolean(p.wishlistOnly); syncSearch(state.query); elements.sort.value = state.sort; document.documentElement.dataset.theme = getTheme(); elements.themeBtn.textContent = getTheme() === "dark" ? "☀" : "☾"; }

// Events
["input"].forEach((type) => { elements.search.addEventListener(type, (e) => setQuery(e.target.value)); elements.mobileSearch.addEventListener(type, (e) => setQuery(e.target.value)); });
elements.sort.addEventListener("change", (e) => { state.sort = e.target.value; render(); });
elements.tabs.addEventListener("click", (e) => { const tab = e.target.closest("[data-category]"); if (!tab) return; state.category = tab.dataset.category; render(); });
elements.grid.addEventListener("click", (e) => { const add = e.target.closest("[data-add]"); const wish = e.target.closest("[data-wish]"); const view = e.target.closest("[data-view]"); if (add) addToCart(add.dataset.add); if (wish) toggleWishlist(wish.dataset.wish); if (view) openModal(view.dataset.view); });
elements.retry.addEventListener("click", loadProducts); elements.refresh.addEventListener("click", loadProducts);
elements.clearFilters.addEventListener("click", () => { Object.assign(state, { category: "all", query: "", sort: "default", wishlistOnly: false }); syncSearch(""); elements.sort.value = "default"; render(); });
elements.clearCache.addEventListener("click", () => { clearSavedData(); state.cart = []; state.wishlist = []; Object.assign(state, { category: "all", query: "", sort: "default", wishlistOnly: false }); syncSearch(""); elements.sort.value = "default"; document.documentElement.dataset.theme = "light"; elements.themeBtn.textContent = "☾"; updateCounts(); renderCart(); render(); toast("All saved data has been reset"); });
elements.wishlistBtn.addEventListener("click", () => { state.wishlistOnly = true; render(); document.querySelector("#products").scrollIntoView({ behavior: "smooth" }); });
elements.wishlistFilter.addEventListener("click", () => { state.wishlistOnly = !state.wishlistOnly; render(); });
elements.cartOpen.addEventListener("click", openCart); elements.cartClose.addEventListener("click", closeCart); elements.cartOverlay.addEventListener("click", closeCart);
elements.cartItems.addEventListener("click", (e) => { const q = e.target.closest("[data-qty]"); const r = e.target.closest("[data-remove]"); if (q) changeQuantity(q.dataset.qty, Number(q.dataset.delta)); if (r) removeCart(r.dataset.remove); });
elements.checkout.addEventListener("click", () => state.cart.length && toast("Checkout demo — your cart is ready!"));
elements.modalOverlay.addEventListener("click", closeModal); elements.modalClose.addEventListener("click", closeModal); elements.modal.addEventListener("click", (e) => { const add = e.target.closest("[data-modal-add]"); const wish = e.target.closest("[data-modal-wish]"); if (add) { addToCart(add.dataset.modalAdd); closeModal(); } if (wish) { toggleWishlist(wish.dataset.modalWish); openModal(wish.dataset.modalWish); } });
elements.themeBtn.addEventListener("click", () => { const next = getTheme() === "dark" ? "light" : "dark"; saveTheme(next); document.documentElement.dataset.theme = next; elements.themeBtn.textContent = next === "dark" ? "☀" : "☾"; });
elements.promoAction.addEventListener("click", () => { state.sort = "rating-desc"; elements.sort.value = state.sort; render(); document.querySelector("#products").scrollIntoView({ behavior: "smooth" }); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (elements.modal.classList.contains("is-open")) closeModal(); else if (elements.cartDrawer.classList.contains("is-open")) closeCart(); } if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); elements.search.focus(); } });
window.addEventListener("scroll", () => elements.backTop.classList.toggle("visible", window.scrollY > 500), { passive: true }); elements.backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

restore(); updateCounts(); renderCart(); loadProducts();
