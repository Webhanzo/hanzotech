// src/app/admin/dashboard/messages/page.tsx
import { getMessages } from '@/lib/firebase/firestore';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  // Sort messages by creation date, newest first
  const sortedMessages = messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">رسائل العملاء</h1>
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
                  تم الإرسال في: {format(message.createdAt, 'PPpp')}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
