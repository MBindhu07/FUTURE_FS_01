const BASE = "https://fakestoreapi.com";
const FALLBACK_BASE = "https://dummyjson.com";

async function request(base, path) {
  const response = await fetch(`${base}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" }
  });

  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

function normalizeProducts(data) {
  const items = Array.isArray(data) ? data : data?.products;
  if (!Array.isArray(items)) throw new Error("Unexpected product response.");

  return items.map((product) => ({
    id: product.id,
    title: product.title ?? "Untitled product",
    description: product.description ?? "",
    price: Number(product.price) || 0,
    category: product.category ?? "other",
    image: product.image ?? product.thumbnail ?? product.images?.[0] ?? "",
    rating: Number(product.rating?.rate ?? product.rating ?? 0),
    ratingCount: Number(product.rating?.count ?? 0)
  }));
}

export async function fetchProducts() {
  try {
    return normalizeProducts(await request(BASE, "/products"));
  } catch (primaryError) {
    console.warn("FakeStoreAPI unavailable. Trying fallback API.", primaryError);
    return normalizeProducts(await request(FALLBACK_BASE, "/products?limit=100"));
  }
}

export async function fetchCategories() {
  try {
    const categories = await request(BASE, "/products/categories");
    if (!Array.isArray(categories)) throw new Error("Unexpected category response.");
    return categories;
  } catch (primaryError) {
    console.warn("Category endpoint unavailable. Categories will be derived from products.", primaryError);
    return [];
  }
}
