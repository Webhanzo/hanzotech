// src/components/special-ad.tsx
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
    adPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'center';
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
    'bottom-left': 'bottom-4 start-4',
    'bottom-right': 'bottom-4 end-4',
    'top-left': 'top-4 start-4',
    'top-right': 'top-4 end-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  const animationClasses = {
    'bottom-left': 'animate-in fade-in slide-in-from-bottom-5',
    'bottom-right': 'animate-in fade-in slide-in-from-bottom-5',
    'top-left': 'animate-in fade-in slide-in-from-top-5',
    'top-right': 'animate-in fade-in slide-in-from-top-5',
    'center': 'animate-in fade-in zoom-in-95',
  }

  const adWidth = adData.adWidth || 256;
  const adPosition = adData.adPosition || 'bottom-left';

  return (
    <div className={cn(
        "fixed z-50",
         positionClasses[adPosition],
         animationClasses[adPosition]
         )}>
      <Card 
        style={{ '--ad-max-width': `${adWidth}px` } as React.CSSProperties}
        className="w-[90vw] max-w-[var(--ad-max-width)] overflow-hidden shadow-2xl md:w-auto"
      >
        <CardContent className="relative p-0">
           <div className="absolute right-0 top-0 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-bl-lg rounded-tr-lg bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
              onClick={() => setIsVisible(false)}
              aria-label="إغلاق الإعلان"
            >
              <X className="h-5 w-5" />
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
