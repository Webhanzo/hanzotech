'use client';

import { useEffect, useState } from 'react';
import type { Product as ProductType } from '@/lib/types';
import ProductCard from './product-card';
import { Skeleton } from './ui/skeleton';
import { getProducts } from '@/lib/firebase/database';

export default function ProductRecommendations({ product }: { product: ProductType }) {
  const [recommendations, setRecommendations] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        
        // Simple recommendation: filter by the same category, exclude the current product
        const recommendedProducts = allProducts
          .filter(p => p.category === product.category && p.id !== product.id)
          .slice(0, 3); // Take the first 3

        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [product]);

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
