import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
             <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="https://placehold.co/50x50/e63946/ffffff?text=H"
                alt="HANZO Logo"
                width={50}
                height={50}
                className="rounded-full"
                data-ai-hint="logo"
              />
              <span className="font-headline text-2xl font-bold">HANZO</span>
            </Link>
            <p className="text-center text-muted-foreground md:text-right">
              HANZO - تقنية متميزة لأسلوب حياتك
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-right">
            <h3 className="font-headline mb-4 text-lg font-semibold">تواصل معنا</h3>
            <p className="text-muted-foreground">رقم الهاتف 1: 123-456-789</p>
            <p className="text-muted-foreground">رقم الهاتف 2: 987-654-321</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-headline mb-4 text-lg font-semibold">تابعنا</h3>
            <div className="flex gap-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
              <Link href="#" aria-label="WhatsApp">
                <Phone className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HANZO. كل الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
