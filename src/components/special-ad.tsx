'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getSpecialAd } from '@/lib/firebase/database';

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
    getSpecialAd().then(data => {
        if (data && data.visible) {
            setAdData(data);
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000); 
            return () => clearTimeout(timer);
        }
    });
  }, []);

  if (!isVisible || !adData) {
    return null;
  }

  return (
    <div className="fixed bottom-5 start-5 z-50 animate-in fade-in slide-in-from-bottom-5">
      <Card className="w-64 overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="absolute right-1 top-1 z-10">
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
