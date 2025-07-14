// src/app/admin/dashboard/content/page.tsx
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateDocument, getDocument } from '@/lib/firebase/firestore';
import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const contentSchema = z.object({
  homeImage: z.string().url({ message: 'رابط غير صالح' }),
  featuredImages: z.array(z.object({ value: z.string().url({ message: 'رابط غير صالح' }) })),
  featuredImages2: z.array(z.object({ value: z.string().url({ message: 'رابط غير صالح' }) })),
  header: z.object({
      logo: z.string().url({ message: 'رابط غير صالح' }),
  }),
  footer: z.object({
      logo: z.string().url({ message: 'رابط غير صالح' }),
      about: z.string().min(1, 'مطلوب'),
      facebook: z.string().url({ message: 'رابط غير صالح' }),
      instagram: z.string().url({ message: 'رابط غير صالح' }),
      whatsapp: z.string().url({ message: 'رابط غير صالح' }),
      phone1: z.string().min(1, 'مطلوب'),
      phone2: z.string().min(1, 'مطلوب'),
  }),
  specialAd: z.object({
      visible: z.boolean(),
      image: z.string().url({ message: 'رابط غير صالح' }),
      link: z.string().url({ message: 'رابط غير صالح' }),
      text: z.string().min(1, 'مطلوب'),
  })
});

type ContentFormValues = z.infer<typeof contentSchema>;

export default function ContentManagementPage() {
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
        featuredImages: [],
        featuredImages2: [],
    },
  });

  const { fields: featuredFields, append: appendFeatured, remove: removeFeatured } = useFieldArray({ control: form.control, name: "featuredImages" });
  const { fields: featured2Fields, append: appendFeatured2, remove: removeFeatured2 } = useFieldArray({ control: form.control, name: "featuredImages2" });

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      const homeData = await getDocument('site', 'home');
      const headerData = await getDocument('site', 'header');
      const footerData = await getDocument('site', 'footer');
      const specialAdData = await getDocument('site', 'specialAd');

      form.reset({
        homeImage: homeData?.homeImage || '',
        featuredImages: homeData?.featuredImages?.map((url: string) => ({ value: url })) || [],
        featuredImages2: homeData?.featuredImages2?.map((url: string) => ({ value: url })) || [],
        header: headerData || { logo: '' },
        footer: footerData || { logo: '', about: '', facebook: '', instagram: '', whatsapp: '', phone1: '', phone2: '' },
        specialAd: specialAdData || { visible: false, image: '', link: '', text: '' },
      });
      setLoading(false);
    }
    loadContent();
  }, [form]);


  const onSubmit = (data: ContentFormValues) => {
    startTransition(async () => {
      try {
        const homePayload = {
          homeImage: data.homeImage,
          featuredImages: data.featuredImages.map(item => item.value),
          featuredImages2: data.featuredImages2.map(item => item.value),
        }
        await updateDocument('site', 'home', homePayload);
        await updateDocument('site', 'header', data.header);
        await updateDocument('site', 'footer', data.footer);
        await updateDocument('site', 'specialAd', data.specialAd);

        toast({
          title: 'تم الحفظ بنجاح',
          description: 'تم تحديث محتوى الموقع.',
          className: 'bg-accent text-accent-foreground border-0',
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'حدث خطأ',
          description: 'لم نتمكن من حفظ التغييرات. الرجاء المحاولة مرة أخرى.',
          variant: 'destructive',
        });
      }
    });
  };

  if (loading) {
    return <div className="space-y-4">
        <Skeleton className="h-12 w-1/4"/>
        <Skeleton className="h-64 w-full"/>
        <Skeleton className="h-64 w-full"/>
    </div>
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">إدارة المحتوى</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader><CardTitle>محتوى الهيدر والفوتر</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="header.logo" render={({ field }) => ( <FormItem><FormLabel>رابط لوجو الهيدر</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="footer.logo" render={({ field }) => ( <FormItem><FormLabel>رابط لوجو الفوتر</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="footer.about" render={({ field }) => ( <FormItem><FormLabel>نبذة عنا (الفوتر)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="footer.phone1" render={({ field }) => ( <FormItem><FormLabel>رقم الهاتف 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="footer.phone2" render={({ field }) => ( <FormItem><FormLabel>رقم الهاتف 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="footer.facebook" render={({ field }) => ( <FormItem><FormLabel>رابط فيسبوك</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="footer.instagram" render={({ field }) => ( <FormItem><FormLabel>رابط انستغرام</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="footer.whatsapp" render={({ field }) => ( <FormItem><FormLabel>رابط واتساب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>محتوى الصفحة الرئيسية</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="homeImage" render={({ field }) => ( <FormItem><FormLabel>صورة الهيرو الرئيسية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                     <div>
                        <Label>صور الكاروسيل الأول</Label>
                        {featuredFields.map((field, index) => (
                            <FormField key={field.id} control={form.control} name={`featuredImages.${index}.value`} render={({ field }) => (
                                <FormItem className="flex items-center gap-2 mt-2">
                                    <FormControl><Input {...field} /></FormControl>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeFeatured(index)}><Trash2 className="h-4 w-4" /></Button>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        ))}
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendFeatured({ value: "" })}>
                            <PlusCircle className="me-2 h-4 w-4"/> إضافة صورة
                        </Button>
                    </div>
                     <div>
                        <Label>صور الكاروسيل الثاني (منتجات مميزة)</Label>
                        {featured2Fields.map((field, index) => (
                            <FormField key={field.id} control={form.control} name={`featuredImages2.${index}.value`} render={({ field }) => (
                                <FormItem className="flex items-center gap-2 mt-2">
                                    <FormControl><Input {...field} /></FormControl>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeFeatured2(index)}><Trash2 className="h-4 w-4" /></Button>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        ))}
                         <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendFeatured2({ value: "" })}>
                            <PlusCircle className="me-2 h-4 w-4"/> إضافة صورة
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>الإعلان الخاص المنبثق</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <FormField control={form.control} name="specialAd.visible" render={({ field }) => (
                         <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">تفعيل الإعلان</FormLabel>
                                <FormDescription>هل تريد عرض الإعلان المنبثق للزوار؟</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                     )}/>
                    <FormField control={form.control} name="specialAd.image" render={({ field }) => ( <FormItem><FormLabel>رابط صورة الإعلان</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="specialAd.link" render={({ field }) => ( <FormItem><FormLabel>رابط وجهة الإعلان</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="specialAd.text" render={({ field }) => ( <FormItem><FormLabel>نص الإعلان</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </CardContent>
            </Card>

          <Button type="submit" disabled={isPending}>{isPending ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}</Button>
        </form>
      </Form>
    </div>
  );
}
