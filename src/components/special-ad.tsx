'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type SpecialAdData = {
    image: string;
    link: string;
    text: string;
    visible: boolean;
}

export default function SpecialAd() {
  const [isVisible, setIsVisible] = useState(false);
  const [adData, setAdData] = useState<SpecialAdData | null>(null);

  useEffect(() => {
    // In a real app, you would fetch this from your database
    const fetchedAdData: SpecialAdData = {
        image: "https://scontent.famm2-3.fna.fbcdn.net/v/t39.30808-6/483983657_655510334001880_118447396326113016_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=OgMY2DDRr2cQ7kNvgF_TnO5&_nc_oc=AdnCPanLd5sl0bG3wPQ_wQlt0GXZ025B7g-B1d5u_ukAXcGINwHBVYy9FDMimcgUl9k&_nc_zt=23&_nc_ht=scontent.famm2-3.fna&_nc_gid=KJrkanJvNeeeW-NzdVuWug&oh=00_AYGK1VFdtploQNV7G6QZXTKh5Ttc3FhoNqzyUGvEc0CZxA&oe=67E671E1",
        link: "#",
        text: "عروض خاصة!",
        visible: true // Control visibility from DB
    };
    setAdData(fetchedAdData);

    if (fetchedAdData.visible) {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000); 
        return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible || !adData) {
    return null;
  }

  return (
    <div className="fixed bottom-5 start-5 z-50 animate-in fade-in slide-in-from-bottom-5">
      <Card className="w-64 overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="absolute top-1 right-1 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
              onClick={() => setIsVisible(false)}
              aria-label="إغلاق الإعلان"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Link href={adData.link} className="block">
            <Image
              src={adData.image}
              alt={adData.text}
              width={256}
              height={150}
              className="w-full object-cover"
              data-ai-hint="special offer"
            />
            <div className="p-4">
              <p className="text-center font-semibold text-foreground">{adData.text}</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
