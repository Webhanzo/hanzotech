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
import { useEffect, useState, useRef } from 'react';
import { getDocument, updateDocument, getFeaturedCarousel, updateFeaturedCarousel } from '@/lib/firebase/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Trash2, Edit, Upload } from 'lucide-react';
import Image from 'next/image';
import type { CarouselImage } from '@/lib/types';
import { uploadImage } from '@/lib/firebase/storage';


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
  whatsapp: z.string().min(1, 'الحقل مطلوب'),
  adImage: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  adLink: z.string().url('رابط غير صالح').min(1, 'الحقل مطلوب'),
  adText: z.string().min(1, 'الحقل مطلوب'),
  adVisible: z.boolean(),
  adWidth: z.coerce.number().min(100, "العرض يجب أن يكون 100 على الأقل"),
  adHeight: z.coerce.number().min(100).optional(),
  adPosition: z.enum(['bottom-left', 'bottom-right', 'top-left', 'top-right', 'center']),
});

const carouselImageSchema = z.object({
    imageUrl: z.string().url({ message: 'الرجاء إدخال رابط صورة صالح' }),
    linkUrl: z.string().url({ message: 'الرجاء إدخال رابط صالح' }).optional().or(z.literal('')),
    width: z.coerce.number().positive('يجب أن يكون العرض رقمًا موجبًا').optional(),
    height: z.coerce.number().positive('يجب أن يكون الارتفاع رقمًا موجبًا').optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

// Helper component for image uploading
const ImageUploadField = ({ field, label, onUpload, isUploading }: { field: any, label: string, onUpload: (file: File) => Promise<string>, isUploading: boolean }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const url = await onUpload(file);
                field.onChange(url);
            } catch (error) {
                console.error("Upload failed", error);
            }
        }
    };

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="flex items-center gap-4">
                <FormControl>
                    <Input {...field} placeholder="https://..." />
                </FormControl>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    <Upload className="me-2 h-4 w-4" />
                    {isUploading ? "جارٍ الرفع..." : "رفع"}
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
            {field.value && <Image src={field.value} alt="Preview" width={80} height={80} className="mt-2 rounded-md object-contain" />}
            <FormMessage />
        </FormItem>
    );
};


export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [isCarouselSubmitting, setIsCarouselSubmitting] = useState(false);
  const [isCarouselDialogOpen, setIsCarouselDialogOpen] = useState(false);
  const [editingCarouselImage, setEditingCarouselImage] = useState<CarouselImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const carouselFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
        const url = await uploadImage(file, 'settings/');
        toast({ title: "تم رفع الصورة بنجاح" });
        return url;
    } catch (error) {
        toast({ title: "فشل رفع الصورة", variant: "destructive" });
        throw error;
    } finally {
        setIsUploading(false);
    }
  };

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      headerLogo: '',
      headerLogoWidth: 40,
      headerLogoHeight: 40,
      footerLogo: '',
      footerLogoWidth: 50,
      footerLogoHeight: 50,
      homeImage: '',
      footerAbout: '',
      phone1: '',
      phone2: '',
      facebook: '',
      instagram: '',
      whatsapp: '',
      adImage: '',
      adLink: '',
      adText: '',
      adVisible: false,
      adWidth: 256,
      adHeight: 256,
      adPosition: 'bottom-left',
    },
  });

  const carouselForm = useForm<z.infer<typeof carouselImageSchema>>({
    resolver: zodResolver(carouselImageSchema),
    defaultValues: { imageUrl: '', linkUrl: '', width: undefined, height: undefined },
  });

  async function loadData() {
    setLoading(true);
    try {
      const [header, footer, homeImage, specialAds, carouselData] = await Promise.all([
          getDocument('header'),
          getDocument('footer'),
          getDocument('homeImage'),
          getDocument('specialAds'),
          getFeaturedCarousel()
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
          adHeight: specialAds?.adHeight || 256,
          adPosition: specialAds?.adPosition || 'bottom-left',
      };
      settingsForm.reset(settingsData as any);
      setCarouselImages(carouselData || []);

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

  useEffect(() => {
    loadData();
  }, []);
  
  const onSettingsSubmit = async (values: SettingsFormValues) => {
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

  const handleCarouselFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        try {
            const url = await handleUpload(file);
            carouselForm.setValue('imageUrl', url);
        } catch (error) {
            console.error("Upload failed", error);
        }
    }
  };

  const handleCarouselSubmit = async (values: z.infer<typeof carouselImageSchema>) => {
    setIsCarouselSubmitting(true);
    let updatedImages: CarouselImage[];
    const newValues = {
        ...values,
        width: values.width || undefined,
        height: values.height || undefined,
    };

    if (editingCarouselImage) {
        updatedImages = carouselImages.map(img => 
            img.imageUrl === editingCarouselImage.imageUrl ? { ...editingCarouselImage, ...newValues } : img
        );
    } else {
        updatedImages = [...carouselImages, newValues];
    }
    
    try {
      await updateFeaturedCarousel(updatedImages);
      setCarouselImages(updatedImages);
      toast({ title: 'تم حفظ صورة الكاروسيل بنجاح!', className: 'bg-accent text-accent-foreground border-0' });
      setIsCarouselDialogOpen(false);
    } catch (error) {
      toast({ title: 'فشل حفظ صورة الكاروسيل', variant: 'destructive' });
    } finally {
      setIsCarouselSubmitting(false);
    }
  };
  
  const handleCarouselDelete = async (imageUrlToDelete: string) => {
    const updatedImages = carouselImages.filter(img => img.imageUrl !== imageUrlToDelete);
    try {
        await updateFeaturedCarousel(updatedImages);
        setCarouselImages(updatedImages);
        toast({ title: 'تم حذف الصورة بنجاح' });
    } catch(error) {
        toast({ title: 'فشل حذف الصورة', variant: 'destructive' });
    }
  };

  const openAddCarouselDialog = () => {
    setEditingCarouselImage(null);
    carouselForm.reset({ imageUrl: '', linkUrl: '', width: undefined, height: undefined });
    setIsCarouselDialogOpen(true);
  };
  
  const openEditCarouselDialog = (image: CarouselImage) => {
    setEditingCarouselImage(image);
    carouselForm.reset(image);
    setIsCarouselDialogOpen(true);
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
      <Form {...settingsForm}>
        <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>صور الكاروسيل الرئيسي (القسم المميز ١)</CardTitle>
                    <CardDescription>إدارة الصور التي تظهر في الكاروسيل في أعلى الصفحة الرئيسية.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {carouselImages.map((image, index) => (
                            <Card key={index} className="group relative">
                                <Image src={image.imageUrl} alt={`Carousel image ${index+1}`} width={200} height={150} className="aspect-[4/3] w-full rounded-md object-cover"/>
                                <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-md bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button size="icon" variant="outline" onClick={() => openEditCarouselDialog(image)}><Edit className="h-4 w-4"/></Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleCarouselDelete(image.imageUrl)}><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            </Card>
                        ))}
                         <Dialog open={isCarouselDialogOpen} onOpenChange={setIsCarouselDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex h-full min-h-[100px] flex-col items-center justify-center gap-2" onClick={openAddCarouselDialog}>
                                    <PlusCircle className="h-8 w-8 text-muted-foreground"/>
                                    <span className="text-muted-foreground">إضافة صورة</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent dir='rtl'>
                                <Form {...carouselForm}>
                                    <form onSubmit={carouselForm.handleSubmit(handleCarouselSubmit)} className="space-y-4">
                                        <DialogHeader>
                                            <DialogTitle>{editingCarouselImage ? 'تعديل صورة الكاروسيل' : 'إضافة صورة جديدة للكاروسيل'}</DialogTitle>
                                        </DialogHeader>
                                        <FormField control={carouselForm.control} name="imageUrl" render={({ field }) => (
                                            <ImageUploadField 
                                                field={field} 
                                                label="الصورة"
                                                onUpload={handleUpload}
                                                isUploading={isUploading}
                                            />
                                        )}/>
                                         <FormField control={carouselForm.control} name="linkUrl" render={({ field }) => (
                                            <FormItem><FormLabel>الرابط (عند الضغط على الصورة)</FormLabel><FormControl><Input {...field} placeholder="اختياري، مثال: /products/some-product"/>
                                            </FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={carouselForm.control} name="width" render={({ field }) => (
                                                <FormItem><FormLabel>العرض (px)</FormLabel><FormControl><Input type="number" {...field} placeholder="اختياري، مثال: 400" /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={carouselForm.control} name="height" render={({ field }) => (
                                                <FormItem><FormLabel>الارتفاع (px)</FormLabel><FormControl><Input type="number" {...field} placeholder="اختياري، مثال: 300" /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="secondary" onClick={() => setIsCarouselDialogOpen(false)}>إلغاء</Button>
                                            <Button type="submit" disabled={isCarouselSubmitting}>{isCarouselSubmitting ? "جارٍ الحفظ..." : "حفظ"}</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>الصور والشعارات</CardTitle>
                    <CardDescription>التحكم في شعارات الموقع والصور الرئيسية.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <FormField control={settingsForm.control} name="headerLogo" render={({ field }) => (
                        <ImageUploadField field={field} label="شعار الهيدر" onUpload={handleUpload} isUploading={isUploading} />
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={settingsForm.control} name="headerLogoWidth" render={({ field }) => (
                            <FormItem><FormLabel>عرض شعار الهيدر (px)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={settingsForm.control} name="headerLogoHeight" render={({ field }) => (
                            <FormItem><FormLabel>ارتفاع شعار الهيدر (px)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={settingsForm.control} name="footerLogo" render={({ field }) => (
                        <ImageUploadField field={field} label="شعار الفوتر" onUpload={handleUpload} isUploading={isUploading} />
                    )}/>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={settingsForm.control} name="footerLogoWidth" render={({ field }) => (
                            <FormItem><FormLabel>عرض شعار الفوتر (px)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={settingsForm.control} name="footerLogoHeight" render={({ field }) => (
                            <FormItem><FormLabel>ارتفاع شعار الفوتر (px)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <FormField control={settingsForm.control} name="homeImage" render={({ field }) => (
                       <ImageUploadField field={field} label="صورة الخلفية الرئيسية (Hero)" onUpload={handleUpload} isUploading={isUploading} />
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>معلومات الفوتر والتواصل</CardTitle></CardHeader>
                <CardContent className='space-y-4'>
                    <FormField control={settingsForm.control} name="footerAbout" render={({ field }) => (
                        <FormItem><FormLabel>نبذة عن الشركة في الفوتر</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={settingsForm.control} name="phone1" render={({ field }) => (
                        <FormItem><FormLabel>رقم الهاتف الأول</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={settingsForm.control} name="phone2" render={({ field }) => (
                        <FormItem><FormLabel>رقم الهاتف الثاني</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={settingsForm.control} name="facebook" render={({ field }) => (
                        <FormItem><FormLabel>رابط فيسبوك</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={settingsForm.control} name="instagram" render={({ field }) => (
                        <FormItem><FormLabel>رابط انستغرام</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={settingsForm.control} name="whatsapp" render={({ field }) => (
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
                    <FormField control={settingsForm.control} name="adImage" render={({ field }) => (
                        <ImageUploadField field={field} label="صورة الإعلان" onUpload={handleUpload} isUploading={isUploading} />
                    )}/>
                    <FormField control={settingsForm.control} name="adText" render={({ field }) => (
                        <FormItem><FormLabel>نص الإعلان</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={settingsForm.control} name="adLink" render={({ field }) => (
                        <FormItem><FormLabel>رابط الإعلان (عند الضغط)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField control={settingsForm.control} name="adWidth" render={({ field }) => (
                            <FormItem><FormLabel>عرض الإعلان (بكسل)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={settingsForm.control} name="adHeight" render={({ field }) => (
                            <FormItem><FormLabel>طول الإعلان (بكسل، اختياري)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={settingsForm.control} name="adPosition" render={({ field }) => (
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
                    <FormField control={settingsForm.control} name="adVisible" render={({ field }) => (
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
                {isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات العامة"}
            </Button>
        </form>
      </Form>
    </div>
  );
}
