import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowLeft } from 'lucide-react';
import { products as allProducts } from '@/lib/products'; // Using local products

export const dynamic = 'force-dynamic';

// Static site data since Firebase is removed
const siteData = {
    homeImage: "https://scontent.famm2-3.fna.fbcdn.net/v/t39.30808-6/476406405_630805916472322_2308860158059805573_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=84T9u_oCG5UQ7kNvgFXNwzO&_nc_oc=AdnOr8923wZTo4dl072_laxaGoUUbg8aMbrrx2EtbRUtTSXL5lwq5FQYo7mbLc6Lv3U&_nc_zt=23&_nc_ht=scontent.famm2-3.fna&_nc_gid=VPC8A_8YJ-JO-lxIBF3oCw&oh=00_AYHzEyz1o5DgZqD9XuDFT5NKmNiI9CPw636xWQUqAI68Tg&oe=67E67E15",
    featuredImages: [
        "https://www.webmotors.com.br/wp-content/uploads/2022/11/08131522/Royal-Enfield-Super-Meteor-650-10.jpg",
        "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6504/6504566_rd.jpg",
        "https://res.cloudinary.com/dgx08zujs/image/upload/v1743468922/484398328_660181293534784_838721784984225036_n_1_dtklrj.jpg"
    ],
    featuredImages2: [
        "https://scontent.famm2-3.fna.fbcdn.net/v/t39.30808-6/484398328_660181293534784_838721784984225036_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=qYVceVTWJ6EQ7kNvgGihvai&_nc_oc=Admec1rSlAtW0-QKKvWG5Nhm66_jQIlCc2TWaUm3RTBM98L1Uio72dD5xLYHhFAKgiA&_nc_zt=23&_nc_ht=scontent.famm2-3.fna&_nc_gid=NEPQb9MGdZGs3kIjGiUKfw&oh=00_AYHfypiXA9RHNSaHhAwLuKL_YdxLZTsq4IOuxc20EfciTw&oe=67F0E822",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsJA3F0yHwkzM4Wi1qVitT20dmTd2iXJUkuCgh8bIWz2tDq1znv_AkSWw&s",
    ]
};

export default async function Home() {
  const featuredProducts = allProducts.filter((p) => p.featured);
  const featuredProducts2 = allProducts.filter((p) => p.featured2);
  const homeImage = siteData?.homeImage || "https://placehold.co/1920x1080/1d3557/ffffff?text=Hero";
  const featuredImages = siteData?.featuredImages || [];
  const featuredImages2 = siteData?.featuredImages2 || [];

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
            <CarouselContent>
              {featuredImages.map((image: string, index: number) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <Link href={`/products`}>
                          <Image
                            src={image}
                            alt={`Featured image ${index + 1}`}
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
              {featuredImages2.map((image: string, index: number) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                         <Link href={`/products`}>
                            <Image
                              src={image}
                              alt={`Featured image 2 ${index + 1}`}
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
