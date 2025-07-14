'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, Search, ShoppingCart, UserCog } from 'lucide-react';
import { useCart } from '@/context/cart-provider';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/products', label: 'المنتجات' },
  { href: '/about', label: 'عن الشركة' },
  { href: '/contact', label: 'اتصل بنا' },
];

const headerData = { 
    logo: "https://res.cloudinary.com/dgx08zujs/image/upload/v1742782985/476020761_630805223139058_9077737273465101288_n-removebg-preview_woaols.png" 
};

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={headerData.logo}
              alt="HANZO Logo"
              width={40}
              height={40}
              className="rounded-full"
              data-ai-hint="logo"
            />
            <span className="font-headline text-2xl font-bold">HANZO</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-lg font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
              href="/admin/login"
              className={cn(
                'text-lg font-medium transition-colors hover:text-primary',
                pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground/60'
              )}
            >
             دخول المشرف
            </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-6 w-6" />
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Shopping Cart">
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full p-0"
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src={headerData.logo}
                    alt="HANZO Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                    data-ai-hint="logo"
                  />
                  <span className="font-headline text-2xl font-bold">HANZO</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                         pathname === link.href ? 'text-primary' : 'text-foreground/80'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                   <Link
                    href="/admin/login"
                    className={cn(
                      'flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary',
                      pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground/80'
                    )}
                  >
                    <UserCog className="h-5 w-5" />
                    دخول المشرف
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
