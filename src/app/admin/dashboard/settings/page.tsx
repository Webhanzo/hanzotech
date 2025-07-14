// src/app/admin/dashboard/settings/page.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <div>
             <h1 className="mb-6 text-2xl font-bold">إعدادات عامة</h1>
            <Card>
                <CardHeader>
                    <CardTitle>تحت الإنشاء</CardTitle>
                    <CardDescription>
                        هذه الصفحة مخصصة للإعدادات العامة للموقع.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>سيتم إضافة المزيد من الخيارات هنا قريبًا.</p>
                </CardContent>
            </Card>
        </div>
    )
}
