import { createClient } from '@supabase/supabase-js';
import { products as fallbackProducts } from '../store/products';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured =
  typeof SUPABASE_URL === 'string' &&
  SUPABASE_URL.length > 0 &&
  typeof SUPABASE_ANON_KEY === 'string' &&
  SUPABASE_ANON_KEY.length > 0;

const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const PRODUCT_COLUMNS =
  'slug, title, price, discount, limited, images, framePrice, couponCode, couponDiscount, imageRotateDeg';

const sanitizeProduct = (rawProduct) => {
  if (!rawProduct || typeof rawProduct !== 'object') return null;

  const slug = String(rawProduct.slug || '').trim();
  const title = String(rawProduct.title || '').trim();
  const price = Number(rawProduct.price);
  const discount = Number(rawProduct.discount);
  const limited = Boolean(rawProduct.limited);
  const framePrice = Number(rawProduct.framePrice ?? 700);
  const couponCode = String(rawProduct.couponCode || 'POV2026').trim();
  const couponDiscount = Number(rawProduct.couponDiscount ?? 26);
  const imageRotateDeg = Number(rawProduct.imageRotateDeg ?? 0);

  const images = Array.isArray(rawProduct.images)
    ? rawProduct.images
        .filter((img) => typeof img === 'string' && img.startsWith('/'))
        .slice(0, 5)
    : [];

  if (!slug || !title || Number.isNaN(price) || Number.isNaN(discount) || images.length === 0) {
    return null;
  }

  return {
    slug,
    title,
    price: Math.max(0, Math.round(price)),
    discount: Math.min(100, Math.max(0, Math.round(discount))),
    limited,
    framePrice: Math.max(0, Math.round(framePrice)),
    couponCode: couponCode || 'POV2026',
    couponDiscount: Math.min(100, Math.max(0, Math.round(couponDiscount))),
    imageRotateDeg: Math.min(20, Math.max(-20, imageRotateDeg)),
    images,
  };
};

const getSanitizedFallbackProducts = () =>
  fallbackProducts.map(sanitizeProduct).filter(Boolean);

export async function getAllProducts() {
  if (!supabase) {
    return getSanitizedFallbackProducts();
  }

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('title', { ascending: true });

  if (error || !Array.isArray(data)) {
    return getSanitizedFallbackProducts();
  }

  const sanitizedProducts = data.map(sanitizeProduct).filter(Boolean);
  return sanitizedProducts.length > 0
    ? sanitizedProducts
    : getSanitizedFallbackProducts();
}

export async function getProductBySlug(slug) {
  const safeSlug = String(slug || '').trim();
  if (!safeSlug || !/^[a-zA-Z0-9-]+$/.test(safeSlug)) {
    return null;
  }

  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .eq('slug', safeSlug)
      .maybeSingle();

    if (!error && data) {
      const product = sanitizeProduct(data);
      if (product) return product;
    }
  }

  return (
    getSanitizedFallbackProducts().find(
      (product) => product.slug.toLowerCase() === safeSlug.toLowerCase()
    ) || null
  );
}

export { isSupabaseConfigured };
