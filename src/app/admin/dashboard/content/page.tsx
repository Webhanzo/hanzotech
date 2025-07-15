// src/app/admin/dashboard/content/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getDocument, updateDocument } from '@/lib/firebase/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const contentSchema = z.object({
  // Home Page
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  // About Page
  aboutTitle: z.string().optional(),
  aboutSubtitle: z.string().optional(),
  aboutParagraph: z.string().optional(),
  aboutListTitle: z.string().optional(),
  aboutListItem1: z.string().optional(),
  aboutListItem2: z.string().optional(),
  aboutListItem3: z.string().optional(),
  aboutListItem4: z.string().optional(),
  aboutCtaTitle: z.string().optional(),
  aboutCtaParagraph: z.string().optional(),
  aboutClosingLine: z.string().optional(),
  aboutImage: z.string().url({ message: 'الرجاء إدخال رابط صورة صالح' }).or(z.literal('')).optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

export default function ContentManagementPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {},
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const contentData = await getDocument('content');
        if (contentData) {
          form.reset(contentData as ContentFormValues);
        }
      } catch (error) {
        console.error("Failed to load content:", error);
        toast({
          title: 'فشل تحميل المحتوى',
          description: 'لم نتمكن من جلب بيانات المحتوى الحالية.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [form, toast]);
  
  const onSubmit = async (values: ContentFormValues) => {
    setIsSubmitting(true);
    try {
      await updateDocument('content', values);
      toast({
        title: 'تم تحديث المحتوى بنجاح!',
        description: 'تم حفظ التغييرات في قاعدة البيانات.',
        className: 'bg-accent text-accent-foreground border-0',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من تحديث المحتوى.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">إدارة المحتوى</h1>
        <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">إدارة المحتوى</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader><CardTitle>محتوى الصفحة الرئيسية</CardTitle></CardHeader>
                <CardContent className='space-y-4'>
                    <FormField control={form.control} name="heroTitle" render={({ field }) => (
                        <FormItem><FormLabel>العنوان الرئيسي (Hero)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
                        <FormItem><FormLabel>العنوان الفرعي (Hero)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>محتوى صفحة "عن الشركة"</CardTitle></CardHeader>
                <CardContent className='space-y-4'>
                    <FormField control={form.control} name="aboutImage" render={({ field }) => (
                        <FormItem><FormLabel>رابط صورة "عن الشركة"</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="aboutTitle" render={({ field }) => (
                        <FormItem><FormLabel>العنوان الرئيسي</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutSubtitle" render={({ field }) => (
                        <FormItem><FormLabel>العنوان الفرعي</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutParagraph" render={({ field }) => (
                        <FormItem><FormLabel>الفقرة التعريفية</FormLabel><FormControl><Textarea {...field} className="min-h-[120px]" /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutListTitle" render={({ field }) => (
                        <FormItem><FormLabel>عنوان القائمة (لماذا Hanzo؟)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutListItem1" render={({ field }) => (
                        <FormItem><FormLabel>عنصر القائمة 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutListItem2" render={({ field }) => (
                        <FormItem><FormLabel>عنصر القائمة 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutListItem3" render={({ field }) => (
                        <FormItem><FormLabel>عنصر القائمة 3</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutListItem4" render={({ field }) => (
                        <FormItem><FormLabel>عنصر القائمة 4</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutCtaTitle" render={({ field }) => (
                        <FormItem><FormLabel>عنوان الدعوة للعمل (لا تضيع الفرصة)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutCtaParagraph" render={({ field }) => (
                        <FormItem><FormLabel>فقرة الدعوة للعمل</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="aboutClosingLine" render={({ field }) => (
                        <FormItem><FormLabel>السطر الختامي</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </Button>
        </form>
      </Form>
    </div>
  );
}
