import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import ProductRecommendations from '@/components/product-recommendations';
import AddToCartButton from './add-to-cart-button';
import { getProductBySlug, getProducts } from '@/lib/firebase/database'; // Use local products
import BackButton from '@/components/back-button';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
        <div className="mb-8">
            <BackButton>رجوع إلى المنتجات</BackButton>
        </div>
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
           <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="h-full w-full rounded-lg object-contain"
            data-ai-hint="product image"
          />
        </div>
        <div className="flex flex-col py-4">
          <Badge
            className="w-fit"
            variant={product.condition === 'New' ? 'default' : 'secondary'}
          >
            {product.condition === 'New' ? 'جديد' : 'مستعمل'}
          </Badge>
          <h1 className="font-headline mt-4 text-2xl font-bold md:text-3xl lg:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-primary">{product.price.toLocaleString()} د.أ</p>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">{product.longDescription}</p>
          
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="font-headline mb-8 text-center text-2xl font-bold tracking-tight md:text-3xl">قد يعجبك ايضا</h2>
        <ProductRecommendations product={product} />
      </div>
    </div>
  );
}
