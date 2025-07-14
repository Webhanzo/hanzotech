// src/app/admin/dashboard/products/_components/product-actions.tsx
'use client';
import { Button } from '@/components/ui/button';
import { deleteProduct } from '@/lib/firebase/firestore';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

export default function ProductActions({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProduct(productId);
        toast({
          title: 'تم الحذف بنجاح',
          description: 'تم حذف المنتج من قاعدة البيانات.',
          className: 'bg-accent text-accent-foreground border-0',
        });
      } catch (error) {
        toast({
          title: 'حدث خطأ',
          description: 'لم نتمكن من حذف المنتج. الرجاء المحاولة مرة أخرى.',
          variant: 'destructive',
        });
        console.error(error);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="icon">
        <Link href={`/admin/dashboard/products/edit/${productId}`}>
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={isPending}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent dir='rtl'>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المنتج نهائيًا من قاعدة البيانات الخاصة بك.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                {isPending ? "جارٍ الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
