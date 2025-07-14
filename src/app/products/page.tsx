'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products } from '@/lib/products'; // Use local products
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['جميع المنتجات', 'Laptops', 'Phones'];

export default function ProductsPage() {
  const [allProducts] = useState<Product[]>(products);
  const [loading] = useState(false); // No loading needed for static data
  const [activeCategory, setActiveCategory] = useState('جميع المنتجات');
  const [sortOption, setSortOption] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts;

    if (activeCategory !== 'جميع المنتجات') {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
        filtered = filtered.filter((p) => p.price >= min);
    }

    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
        filtered = filtered.filter((p) => p.price <= max);
    }

    let sorted = [...filtered];
    if (sortOption === 'low-to-high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-to-low') {
      sorted.sort((a, b) => b.price - a.price);
    }
    
    return sorted;
  }, [allProducts, activeCategory, sortOption, minPrice, maxPrice]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">الفئات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'Laptops' ? 'لابتوبات' : category === 'Phones' ? 'هواتف' : 'جميع المنتجات'}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
                <CardTitle className="font-headline">تصفية المنتجات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                  <Label htmlFor="sort-price">الترتيب حسب السعر</Label>
                  <Select dir="rtl" value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger id="sort-price">
                        <SelectValue placeholder="الترتيب الافتراضي" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">الترتيب الافتراضي</SelectItem>
                        <SelectItem value="low-to-high">السعر: من الأقل إلى الأعلى</SelectItem>
                        <SelectItem value="high-to-low">السعر: من الأعلى إلى الأقل</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-price">السعر</Label>
                <div className="flex items-center gap-2">
                    <Input id="min-price" type="number" placeholder="الأدنى" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                    <span>-</span>
                    <Input id="max-price" type="number" placeholder="الأعلى" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
            <h1 className="font-headline mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {activeCategory === 'Laptops' ? 'لابتوبات' : activeCategory === 'Phones' ? 'هواتف' : 'جميع المنتجات'}
                {!loading && <span className="text-lg font-normal text-muted-foreground"> ({filteredAndSortedProducts.length} منتجات)</span>}
            </h1>
          {loading ? (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                       <Skeleton className="h-[225px] w-full rounded-xl" />
                       <div className="space-y-2">
                           <Skeleton className="h-4 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                       </div>
                   </div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
