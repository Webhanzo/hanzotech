import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  // Messages are no longer stored in a database.
  const sortedMessages: any[] = [];

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">رسائل العملاء</h1>
      <Card>
        <CardHeader>
            <CardTitle>الوظيفة معطلة</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">تم تعطيل عرض الرسائل لأنه تم إزالة الاتصال بقاعدة البيانات. الرسائل المرسلة من نموذج "اتصل بنا" لن يتم حفظها.</p>
        </CardContent>
      </Card>
      {/* 
      {sortedMessages.length === 0 ? (
        <p className="text-muted-foreground">لا توجد رسائل لعرضها.</p>
      ) : (
        <div className="space-y-4">
          {sortedMessages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <CardTitle>{message.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {message.phone}
                </p>
              </CardHeader>
              <CardContent>
                <p>{message.message}</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  تم الإرسال في: {new Date(message.createdAt).toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )} 
      */}
    </div>
  );
}
