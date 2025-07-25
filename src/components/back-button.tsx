'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function BackButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => router.back()}>
      <ArrowRight className="me-2 h-4 w-4" />
      {children}
    </Button>
  );
}
