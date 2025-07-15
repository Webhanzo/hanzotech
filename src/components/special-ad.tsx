'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getSpecialAd } from '@/lib/firebase/database';
import { cn } from '@/lib/utils';

type SpecialAdData = {
    image: string;
    link: string;
    text: string;
    visible: boolean;
    adWidth?: number;
    adPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
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
  
  const positionClasses = {
    'bottom-left': 'bottom-5 start-5',
    'bottom-right': 'bottom-5 end-5',
    'top-left': 'top-5 start-5',
    'top-right': 'top-5 end-5',
  }

  const adWidth = adData.adWidth || 256;

  return (
    <div className={cn(
        "fixed z-50 animate-in fade-in slide-in-from-bottom-5",
         positionClasses[adData.adPosition || 'bottom-left']
         )}>
      <Card style={{width: `${adWidth}px`}} className="overflow-hidden shadow-2xl">
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
              width={adWidth}
              height={Math.round(adWidth * 0.6)} // Maintain a reasonable aspect ratio
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
