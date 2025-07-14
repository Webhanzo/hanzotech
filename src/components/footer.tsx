import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Phone } from 'lucide-react';
import { getDocument } from '@/lib/firebase/firestore';

export default async function Footer() {
  const footerData = await getDocument('site', 'footer') || {
    about: "HANZO - تقنية متميزة لأسلوب حياتك",
    facebook: "#",
    instagram: "#",
    logo: "https://placehold.co/50x50.png",
    phone1: "N/A",
    phone2: "N/A",
    whatsapp: "#"
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
             <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src={footerData.logo}
                alt="HANZO Logo"
                width={50}
                height={50}
                className="rounded-full"
                data-ai-hint="logo"
              />
              <span className="font-headline text-2xl font-bold">HANZO</span>
            </Link>
            <p className="text-center text-muted-foreground md:text-right">
              {footerData.about}
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-right">
            <h3 className="font-headline mb-4 text-lg font-semibold">تواصل معنا</h3>
            <p className="text-muted-foreground">رقم الهاتف 1: {footerData.phone1}</p>
            <p className="text-muted-foreground">رقم الهاتف 2: {footerData.phone2}</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-headline mb-4 text-lg font-semibold">تابعنا</h3>
            <div className="flex gap-4">
              <Link href={footerData.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
              <Link href={footerData.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
              <Link href={footerData.whatsapp} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
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
