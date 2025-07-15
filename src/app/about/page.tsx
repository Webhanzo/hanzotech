// src/app/about/page.tsx
'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getDocument } from '@/lib/firebase/database';
import { Skeleton } from '@/components/ui/skeleton';

type AboutContent = {
  aboutTitle: string;
  aboutSubtitle: string;
  aboutParagraph: string;
  aboutListTitle: string;
  aboutListItem1: string;
  aboutListItem2: string;
  aboutListItem3: string;
  aboutListItem4: string;
  aboutCtaTitle: string;
  aboutCtaParagraph: string;
  aboutClosingLine: string;
  aboutImage: string;
}

export default function AboutPage() {
  const [content, setContent] = useState<Partial<AboutContent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const contentData = await getDocument('content');
        if (contentData) {
          setContent(contentData as AboutContent);
        }
      } catch (error) {
        console.error("Failed to load about page content:", error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="order-last space-y-4 md:order-first">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-[700px] w-[600px] rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
           <div className="order-last md:order-first">
             <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
              {content.aboutTitle || "عن HANZO"}
            </h1>
            <h2 className="mt-4 font-headline text-2xl font-semibold md:text-3xl">
              {content.aboutSubtitle || "تقنيتك بلمسة تميّز وسرعة لا تُضاهى"}
            </h2>
            <div className="prose prose-lg mt-6 max-w-full text-muted-foreground">
              <p>
                {content.aboutParagraph || "في عالمٍ تسوده السرعة والابتكار، تبرز Hanzo كشريكك المثالي في عالم التقنية..."}
              </p>
              <strong>{content.aboutListTitle || "لماذا Hanzo؟"}</strong>
              <ul>
                {content.aboutListItem1 && <li>{content.aboutListItem1}</li>}
                {content.aboutListItem2 && <li>{content.aboutListItem2}</li>}
                {content.aboutListItem3 && <li>{content.aboutListItem3}</li>}
                {content.aboutListItem4 && <li>{content.aboutListItem4}</li>}
              </ul>
               <strong>{content.aboutCtaTitle || "لا تُضيّع الفرصة!"}</strong>
              <p>
                {content.aboutCtaParagraph || "انضم إلى آلاف العملاء الذين اختاروا Hanzo ليكونوا في الصدارة..."}
              </p>
               <p className="font-headline text-lg font-semibold text-foreground">{content.aboutClosingLine || "Hanzo — حيث التميّز التقني يلتقي باحتياجاتك!"}</p>
            </div>
           </div>
           <div>
            <Image
                src={content.aboutImage || "https://placehold.co/600x700.png"}
                alt="فريق هانزو"
                width={600}
                height={700}
                className="rounded-lg object-cover shadow-xl"
                data-ai-hint="team work"
              />
           </div>
        </div>
      </div>
    </div>
  );
}
