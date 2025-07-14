'use client';

import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { addOrder } from '@/lib/firebase/database';

const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: 'الاسم مطلوب' }),
  phoneNumber: z.string().min(10, { message: 'رقم الهاتف مطلوب' }),
  deliveryMethod: z.enum(['pickup', 'delivery']),
  city: z.string().optional(),
  landmark: z.string().optional(),
}).refine(data => data.deliveryMethod !== 'delivery' || (!!data.city && data.city.length > 0), {
    message: 'المدينة مطلوبة للتوصيل',
    path: ['city'],
}).refine(data => data.deliveryMethod !== 'delivery' || (!!data.landmark && data.landmark.length > 0), {
    message: 'أقرب معلم بارز مطلوب للتوصيل',
    path: ['landmark'],
});


export default function CartPage() {
  const { state, removeItem, clearCart, totalPrice, itemCount } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      deliveryMethod: 'pickup',
      city: '',
      landmark: '',
    },
  });

  const deliveryMethod = form.watch('deliveryMethod');

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    setIsSubmitting(true);
    
    try {
        await addOrder({ ...values, items: state.items });
        toast({
            title: "تم إرسال الطلب بنجاح!",
            description: "شكراً لطلبك. سنتواصل معك قريباً لتأكيد التفاصيل.",
            className: 'bg-accent text-accent-foreground border-0',
          });
        form.reset();
        clearCart();
    } catch(error) {
        console.error("Failed to submit order: ", error);
        toast({
            title: "حدث خطأ",
            description: "لم نتمكن من إرسال طلبك. الرجاء المحاولة مرة أخرى.",
            variant: "destructive",
        })
    } finally {
        setIsSubmitting(false);
    }
  }

  if (itemCount === 0) {
    return (
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-16 text-center md:px-6 lg:py-24">
         <ShoppingBag className="h-24 w-24 text-muted-foreground" />
        <h1 className="font-headline text-3xl font-bold">سلة التسوق فارغة</h1>
        <p className="text-muted-foreground">لم تقم بإضافة أي منتجات إلى سلتك بعد.</p>
        <Button asChild>
          <a href="/products">العودة للتسوق</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
      <h1 className="font-headline mb-8 text-center text-3xl font-bold md:text-4xl">سلة التسوق</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
            {state.items.map(item => (
                <Card key={item.id} className="flex items-center p-4">
                    <Image src={item.image} alt={item.name} width={100} height={100} className="rounded-md object-cover" data-ai-hint="product image" />
                    <div className="me-4 flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.price.toLocaleString()} د.أ x {item.quantity}</p>
                        <p className="text-lg font-bold text-primary">{(item.price * item.quantity).toLocaleString()} د.أ</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                </Card>
            ))}
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>المجموع الفرعي</span>
                        <span>{totalPrice.toLocaleString()} د.أ</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>الإجمالي</span>
                        <span>{totalPrice.toLocaleString()} د.أ</span>
                    </div>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border-t pt-4">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem><FormLabel>الاسم الكامل</FormLabel><FormControl><Input placeholder="اسمك الكامل" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                <FormItem><FormLabel>رقم الهاتف</FormLabel><FormControl><Input placeholder="رقم هاتفك" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="deliveryMethod" render={({ field }) => (
                                <FormItem>
                                <FormLabel>طريقة الاستلام</FormLabel>
                                <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger><SelectValue placeholder="اختر طريقة الاستلام" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="pickup">استلام</SelectItem>
                                    <SelectItem value="delivery">توصيل</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}/>

                            {deliveryMethod === 'delivery' && (
                                <>
                                 <FormField control={form.control} name="city" render={({ field }) => (
                                    <FormItem><FormLabel>المدينة</FormLabel><FormControl><Input placeholder="مدينتك" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="landmark" render={({ field }) => (
                                    <FormItem><FormLabel>أقرب معلم بارز</FormLabel><FormControl><Input placeholder="أقرب معلم لمنطقتك" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                </>
                            )}
                            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>{isSubmitting ? "جارٍ الإرسال..." : "إتمام الطلب"}</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
