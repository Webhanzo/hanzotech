// This page is now disabled as it depends on Firestore which has been removed.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddProductPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">إضافة منتج جديد</h1>
      <Card>
        <CardHeader>
          <CardTitle>الوظيفة معطلة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            تم تعطيل إضافة المنتجات لأنه تم إزالة الاتصال بقاعدة البيانات.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
