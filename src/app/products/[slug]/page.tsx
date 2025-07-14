import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductRecommendations from '@/components/product-recommendations';
import AddToCartButton from './add-to-cart-button';
import { getProducts } from '@/lib/firebase/firestore';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const products = await getProducts();
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border bg-card shadow-sm">
           <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover rounded-lg"
            data-ai-hint="product image"
          />
        </div>
        <div className="flex flex-col">
          <Badge
            className="w-fit"
            variant={product.condition === 'New' ? 'default' : 'secondary'}
          >
            {product.condition === 'New' ? 'جديد' : 'مستعمل'}
          </Badge>
          <h1 className="font-headline mt-4 text-3xl font-bold lg:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-primary">{product.price.toLocaleString()} د.ع</p>
          <p className="mt-6 text-lg text-muted-foreground">{product.longDescription}</p>
          
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="font-headline mb-8 text-center text-3xl font-bold tracking-tight">قد يعجبك ايضا</h2>
        <ProductRecommendations product={product} />
      </div>
    </div>
  );
}
