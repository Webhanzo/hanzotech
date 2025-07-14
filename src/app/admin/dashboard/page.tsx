import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, ShoppingBag, MessageSquare, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">لوحة التحكم</h1>
        <Button asChild>
            <Link href="/products/add">إضافة منتج جديد</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إدارة المنتجات</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              إضافة، تعديل، أو حذف المنتجات
            </p>
             <Button className="mt-4 w-full" variant="outline" asChild>
                <Link href="/admin/dashboard/products">الذهاب</Link>
             </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">رسائل العملاء</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              عرض الرسائل الواردة من صفحة "اتصل بنا"
            </p>
            <Button className="mt-4 w-full" variant="outline" asChild>
                <Link href="/admin/dashboard/messages">الذهاب</Link>
             </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إدارة المحتوى</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground">
              تغيير صور الإعلانات والخلفيات
            </p>
            <Button className="mt-4 w-full" variant="outline" asChild>
                <Link href="/admin/dashboard/content">الذهاب</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إعدادات عامة</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground">
                إدارة إعدادات الموقع العامة
            </p>
            <Button className="mt-4 w-full" variant="outline" asChild>
                <Link href="/admin/dashboard/settings">الذهاب</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="font-headline mb-4 text-2xl font-bold">نظرة عامة سريعة</h2>
        {/* Placeholder for future charts or stats */}
        <Card>
            <CardHeader><CardTitle>إحصائيات</CardTitle></CardHeader>
            <CardContent>
                <p className="text-muted-foreground">سيتم عرض الإحصائيات هنا قريباً.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
