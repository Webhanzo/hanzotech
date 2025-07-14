'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
  password: z.string().min(6, { message: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' }),
});

// Hardcoded credentials as requested
const ADMIN_EMAIL = 'Yazan.Admin@Hanzo.com';
const ADMIN_PASSWORD = 'Xoo0#benn@xsok.2025';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ADMIN_EMAIL,
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (values.email === ADMIN_EMAIL && values.password === ADMIN_PASSWORD) {
      // Mock successful login by storing a value in localStorage
      localStorage.setItem('adminUser', JSON.stringify({ email: values.email }));
      toast({
        title: "تم تسجيل الدخول بنجاح!",
        description: "مرحباً بك في لوحة التحكم.",
        className: 'bg-accent text-accent-foreground border-0',
      });
      router.push('/admin/dashboard');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
    
    setLoading(false);
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] max-w-7xl items-center justify-center px-4 py-16 md:px-6 lg:py-24">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-center text-3xl font-bold">لوحة تحكم المشرف</CardTitle>
          <CardDescription className="text-center">
            الرجاء تسجيل الدخول للمتابعة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
                 <Terminal className="h-4 w-4" />
                <AlertTitle>خطأ في تسجيل الدخول</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} disabled={loading} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
                <LogIn className="ms-2 h-5 w-5" />
              </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground mx-auto">
                هذه الصفحة مخصصة للمشرفين فقط.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
