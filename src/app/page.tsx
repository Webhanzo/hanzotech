import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { Product } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { getProducts } from '@/lib/firebase/firestore';

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.filter((p) => p.featured);
  const featuredProducts2 = products.filter((p) => p.featured2);

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-cover bg-center bg-[url('https://placehold.co/1920x600/1d3557/e63946.png?text=HANZO')]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              تقنية <span className="text-primary">متميزة</span> لك
            </h1>
            <p className="mt-6 text-lg leading-8">
              اكتشف المزيج المثالي من القوة والتصميم والابتكار مع مجموعتنا المختارة من الهواتف واللاب توب
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" variant="default">
                <Link href="/products">
                  تسوق الآن
                  <ArrowLeft className="ms-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/about">اعرف المزيد</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              direction: 'rtl',
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product: Product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <Link href={`/products/${product.slug}`}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={300}
                            className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
                            data-ai-hint="product image"
                          />
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      <section className="w-full bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-headline mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            منتجاتنا المميزة
          </h2>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              direction: 'rtl',
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts2.map((product: Product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                         <Link href={`/products/${product.slug}`}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={400}
                              height={300}
                              className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
                              data-ai-hint="product image"
                            />
                         </Link>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
          <div className="mt-12 text-center">
             <Button asChild size="lg">
                <Link href="/products">
                  عرض كل المنتجات
                  <ArrowLeft className="ms-2 h-5 w-5" />
                </Link>
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
