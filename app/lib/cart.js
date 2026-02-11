const CART_STORAGE_KEY = 'cart';
const MAX_CART_QUANTITY = 10;

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const sanitizeCartItem = (item) => {
  if (!item || typeof item !== 'object') return null;

  const product = String(item.product || '').trim();
  const productName = String(item.productName || '').trim();
  const type = item.type === 'framed' ? 'framed' : 'print';
  const quantity = Number(item.quantity);
  const price = Number(item.price);
  const image = String(item.image || '').trim();

  if (
    !isNonEmptyString(product) ||
    !isNonEmptyString(productName) ||
    !Number.isFinite(quantity) ||
    !Number.isFinite(price) ||
    !isNonEmptyString(image)
  ) {
    return null;
  }

  return {
    product,
    productName,
    type,
    quantity: Math.min(MAX_CART_QUANTITY, Math.max(1, Math.round(quantity))),
    price: Math.max(0, Math.round(price)),
    image,
  };
};

const parseRawCart = (rawCart) => {
  if (!rawCart) return [];

  try {
    const parsed = JSON.parse(rawCart);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeCartItem).filter(Boolean);
  } catch {
    return [];
  }
};

export function readCartFromStorage() {
  if (typeof window === 'undefined') return [];
  return parseRawCart(window.localStorage.getItem(CART_STORAGE_KEY));
}

export function writeCartToStorage(cartItems) {
  if (typeof window === 'undefined') return;

  const safeCart = Array.isArray(cartItems)
    ? cartItems.map(sanitizeCartItem).filter(Boolean)
    : [];

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(safeCart));
}

export function clearCartStorage() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export function upsertCartItem(existingCart, nextItem) {
  const sanitizedIncoming = sanitizeCartItem(nextItem);
  if (!sanitizedIncoming) return Array.isArray(existingCart) ? existingCart : [];

  const safeCart = Array.isArray(existingCart)
    ? existingCart.map(sanitizeCartItem).filter(Boolean)
    : [];

  const existingItemIndex = safeCart.findIndex(
    (item) =>
      item.product === sanitizedIncoming.product && item.type === sanitizedIncoming.type
  );

  if (existingItemIndex >= 0) {
    const mergedQuantity =
      safeCart[existingItemIndex].quantity + sanitizedIncoming.quantity;
    safeCart[existingItemIndex].quantity = Math.min(MAX_CART_QUANTITY, mergedQuantity);
    return safeCart;
  }

  return [...safeCart, sanitizedIncoming];
}

export { MAX_CART_QUANTITY };
