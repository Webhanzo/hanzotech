// src/app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowLeft } from 'lucide-react';
import { getProducts, getHomeImage } from '@/lib/firebase/database';
import { useEffect, useState, useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [homeImage, setHomeImage] = useState("https://placehold.co/1920x1080/1d3557/ffffff?text=Hero");
  const [featuredProducts1, setFeaturedProducts1] = useState<Product[]>([]);
  const [featuredProducts2, setFeaturedProducts2] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const [homeImg, allProducts] = await Promise.all([
          getHomeImage(),
          getProducts(),
        ]);
        if (homeImg) setHomeImage(homeImg);
        
        setFeaturedProducts1(allProducts.filter(p => p.featured));
        setFeaturedProducts2(allProducts.filter(p => p.featured2));

      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderCarouselSkeleton = (count: number, itemClass: string) => (
    <CarouselContent>
        {[...Array(count)].map((_, i) => (
            <CarouselItem key={i} className={itemClass}>
                 <div className="p-1">
                    <Skeleton className="h-64 w-full rounded-lg" />
                 </div>
            </CarouselItem>
        ))}
    </CarouselContent>
  )

  return (
    <div className="flex flex-col items-center">
      <section className="relative w-full py-20 md:py-32 lg:py-40">
        <Image
          src={homeImage}
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          className="z-[-1]"
          data-ai-hint="background technology"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-[-1]"></div>
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
           {loading ? renderCarouselSkeleton(3, "md:basis-1/2 lg:basis-1/3") : (
              <CarouselContent>
                {featuredProducts1.map((product) => (
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
            )}
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
            plugins={[autoplayPlugin.current]}
            onMouseEnter={autoplayPlugin.current.stop}
            onMouseLeave={autoplayPlugin.current.reset}
            className="w-full"
          >
            {loading ? renderCarouselSkeleton(5, "md:basis-1/2 lg:basis-1/4 xl:basis-1/5") : (
                <CarouselContent>
                  {featuredProducts2.map((product) => (
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
            )}
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
