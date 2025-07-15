// src/app/admin/dashboard/settings/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { useEffect, useState } from 'react';
import { getDocument, updateDocument } from '@/lib/firebase/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the schema based on the database structure
const settingsSchema = z.object({
  headerLogo: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  headerLogoWidth: z.coerce.number().min(10).max(200).optional(),
  headerLogoHeight: z.coerce.number().min(10).max(200).optional(),
  footerLogo: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  footerLogoWidth: z.coerce.number().min(10).max(200).optional(),
  footerLogoHeight: z.coerce.number().min(10).max(200).optional(),
  homeImage: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  footerAbout: z.string().min(1, 'الحقل مطلوب'),
  phone1: z.string().min(1, 'الحقل مطلوب'),
  phone2: z.string().min(1, 'الحقل مطلوب'),
  facebook: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  instagram: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  whatsapp: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  adImage: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  adLink: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  adText: z.string().min(1, 'الحقل مطلوب'),
  adVisible: z.boolean(),
  adWidth: z.coerce.number().min(100, "العرض يجب أن يكون 100 على الأقل").max(500, "العرض يجب أن يكون 500 على الأكثر"),
  adHeight: z.coerce.number().min(100).max(500).optional(),
  adPosition: z.enum(['bottom-left', 'bottom-right', 'top-left', 'top-right', 'center']),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      adVisible: false,
      adWidth: 256,
      adPosition: 'bottom-left',
      headerLogoWidth: 40,
      headerLogoHeight: 40,
      footerLogoWidth: 50,
      footerLogoHeight: 50,
    },
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const [header, footer, homeImage, specialAds] = await Promise.all([
            getDocument('header'),
            getDocument('footer'),
            getDocument('homeImage'),
            getDocument('specialAds')
        ]);
        
        const settingsData = {
            headerLogo: header?.logo || '',
            headerLogoWidth: header?.width || 40,
            headerLogoHeight: header?.height || 40,
            footerLogo: footer?.logo || '',
            footerLogoWidth: footer?.width || 50,
            footerLogoHeight: footer?.height || 50,
            homeImage: homeImage || '',
            footerAbout: footer?.about || '',
            phone1: footer?.phone1 || '',
            phone2: footer?.phone2 || '',
            facebook: footer?.facebook || '',
            instagram: footer?.instagram || '',
            whatsapp: footer?.whatsapp || '',
            adImage: specialAds?.image || '',
            adLink: specialAds?.link || '',
            adText: specialAds?.text || '',
            adVisible: specialAds?.visible || false,
            adWidth: specialAds?.adWidth || 256,
            adHeight: specialAds?.adHeight,
            adPosition: specialAds?.adPosition || 'bottom-left',
        };
        form.reset(settingsData);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast({
          title: 'فشل تحميل الإعدادات',
          description: 'لم نتمكن من جلب بيانات الإعدادات الحالية.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [form, toast]);
  
  const onSubmit = async (values: SettingsFormValues) => {
    setIsSubmitting(true);
    try {
        await Promise.all([
            updateDocument('header', { 
                logo: values.headerLogo,
                width: values.headerLogoWidth,
                height: values.headerLogoHeight,
            }),
            updateDocument('footer', { 
                logo: values.footerLogo,
                width: values.footerLogoWidth,
                height: values.footerLogoHeight,
                about: values.footerAbout,
                phone1: values.phone1,
                phone2: values.phone2,
                facebook: values.facebook,
                instagram: values.instagram,
                whatsapp: values.whatsapp,
            }),
            updateDocument('homeImage', values.homeImage),
            updateDocument('specialAds', {
                image: values.adImage,
                link: values.adLink,
                text: values.adText,
                visible: values.adVisible,
                adWidth: values.adWidth,
                adHeight: values.adHeight,
                adPosition: values.adPosition,
            })
        ]);

      toast({
        title: 'تم تحديث الإعدادات بنجاح!',
        description: 'تم حفظ التغييرات في قاعدة البيانات.',
        className: 'bg-accent text-accent-foreground border-0',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من تحديث الإعدادات.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">إعدادات عامة</h1>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">إعدادات عامة</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>الصور والشعارات</CardTitle>
                    <CardDescription>التحكم في شعارات الموقع والصور الرئيسية.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <FormField control={form.control} name="headerLogo" render={({ field }) => (
                        <FormItem><FormLabel>رابط شعار الهيدر</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="headerLogoWidth" render={({ field }) => (
                            <FormItem><FormLabel>عرض شعار الهيدر (px)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="headerLogoHeight" render={({ field }) => (
                            <FormItem><FormLabel>ارتفاع شعار الهيدر (px)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="footerLogo" render={({ field }) => (
                        <FormItem><FormLabel>رابط شعار الفوتر</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="footerLogoWidth" render={({ field }) => (
                            <FormItem><FormLabel>عرض شعار الفوتر (px)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="footerLogoHeight" render={({ field }) => (
                            <FormItem><FormLabel>ارتفاع شعار الفوتر (px)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <FormField control={form.control} name="homeImage" render={({ field }) => (
                        <FormItem><FormLabel>رابط صورة الخلفية الرئيسية (Hero)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>معلومات الفوتر والتواصل</CardTitle></CardHeader>
                <CardContent className='space-y-4'>
                    <FormField control={form.control} name="footerAbout" render={({ field }) => (
                        <FormItem><FormLabel>نبذة عن الشركة في الفوتر</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="phone1" render={({ field }) => (
                        <FormItem><FormLabel>رقم الهاتف الأول</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="phone2" render={({ field }) => (
                        <FormItem><FormLabel>رقم الهاتف الثاني</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="facebook" render={({ field }) => (
                        <FormItem><FormLabel>رابط فيسبوك</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="instagram" render={({ field }) => (
                        <FormItem><FormLabel>رابط انستغرام</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="whatsapp" render={({ field }) => (
                        <FormItem><FormLabel>رابط واتساب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>الإعلان الخاص المنبثق</CardTitle>
                    <CardDescription>
                        يظهر هذا الإعلان في زاوية الشاشة بعد ثوانٍ من تحميل الموقع.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <FormField control={form.control} name="adImage" render={({ field }) => (
                        <FormItem><FormLabel>رابط صورة الإعلان</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="adText" render={({ field }) => (
                        <FormItem><FormLabel>نص الإعلان</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="adLink" render={({ field }) => (
                        <FormItem><FormLabel>رابط الإعلان (عند الضغط)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField control={form.control} name="adWidth" render={({ field }) => (
                            <FormItem><FormLabel>عرض الإعلان (بكسل)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="adHeight" render={({ field }) => (
                            <FormItem><FormLabel>طول الإعلان (بكسل، اختياري)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="adPosition" render={({ field }) => (
                        <FormItem>
                        <FormLabel>موقع الإعلان</FormLabel>
                        <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger><SelectValue placeholder="اختر موقع الإعلان" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="bottom-left">أسفل اليسار</SelectItem>
                                <SelectItem value="bottom-right">أسفل اليمين</SelectItem>
                                <SelectItem value="top-left">أعلى اليسار</SelectItem>
                                <SelectItem value="top-right">أعلى اليمين</SelectItem>
                                <SelectItem value="center">وسط الشاشة</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="adVisible" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>إظهار الإعلان؟</FormLabel>
                                <FormDescription>
                                هل تريد عرض الإعلان الخاص للزوار؟
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
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
