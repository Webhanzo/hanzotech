// This page is now disabled as it depends on Firestore which has been removed.
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContentManagementPage() {
  
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">إدارة المحتوى</h1>
      <Card>
        <CardHeader>
          <CardTitle>الوظيفة معطلة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            تم تعطيل إدارة المحتوى لأنه تم إزالة الاتصال بقاعدة البيانات.
            لتغيير المحتوى، يجب تعديل الكود مباشرة في المكونات المعنية مثل (`src/app/page.tsx`).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
