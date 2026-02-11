import { notFound } from 'next/navigation';
import { getProductBySlug } from '../../lib/products';
import ProductDetailsClient from './ProductDetailsClient';

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params?.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
