'use client';

import { useEffect, useState } from 'react';
import type { Product, Product as ProductType } from '@/lib/types';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import ProductCard from './product-card';
import { Skeleton } from './ui/skeleton';
import { products } from '@/lib/products'; // Use local products

async function getRecommendationsAction(product: ProductType) {
  'use server';
  try {
    const result = await getProductRecommendations({
      productName: product.name,
      productCategory: product.category,
      productDescription: product.description,
    });
    return result.recommendations;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return [];
  }
}

export default function ProductRecommendations({ product }: { product: ProductType }) {
  const [recommendations, setRecommendations] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>(products);

  useEffect(() => {
    if (allProducts.length === 0) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      const recommendedNames = await getRecommendationsAction(product);
      
      const recommendedProducts = allProducts.filter(p => recommendedNames.includes(p.name) && p.id !== product.id);
      
      if (recommendedProducts.length < 3) {
        const fallback = allProducts.filter(p => p.category === product.category && p.id !== product.id && !recommendedNames.includes(p.name));
        const needed = 3 - recommendedProducts.length;
        recommendedProducts.push(...fallback.slice(0, needed));
      }

      setRecommendations(recommendedProducts.slice(0, 3));
      setLoading(false);
    };

    fetchRecommendations();
  }, [product, allProducts]);

  if (loading) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[225px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    )
  }

  if (recommendations.length === 0) {
    return <p className="text-center text-muted-foreground">لا توجد توصيات متاحة حاليًا.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((recProduct) => (
        <ProductCard key={recProduct.id} product={recProduct} />
      ))}
    </div>
  );
}
