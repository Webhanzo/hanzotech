import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Accordion,
  } from "@/components/ui/accordion"

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const sortedOrders: any[] = [];

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">طلبات العملاء</h1>
      <Card>
        <CardHeader>
            <CardTitle>الوظيفة معطلة</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">تم تعطيل عرض الطلبات لأنه تم إزالة الاتصال بقاعدة البيانات.</p>
        </CardContent>
      </Card>
      {/* 
      {sortedOrders.length === 0 ? (
        <p className="text-muted-foreground">لا توجد طلبات لعرضها.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {sortedOrders.map((order) => (
            <AccordionItem value={order.id} key={order.id} className="border rounded-lg bg-card">
              <AccordionTrigger className="p-6">
                <div className='flex flex-col text-start'>
                    <CardTitle>{order.fullName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.phoneNumber}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="space-y-4">
                    <div>
                        <p><strong>تاريخ الطلب:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
                        <p><strong>طريقة الاستلام:</strong> {order.deliveryMethod === 'delivery' ? 'توصيل' : 'استلام'}</p>
                        {order.deliveryMethod === 'delivery' && (
                            <>
                                <p><strong>المدينة:</strong> {order.city}</p>
                                <p><strong>أقرب معلم:</strong> {order.landmark}</p>
                            </>
                        )}
                    </div>
                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">المنتجات المطلوبة:</h4>
                        <div className="space-y-2">
                        {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                                </div>
                                <Badge variant="secondary">{(item.price * item.quantity).toLocaleString()} د.ع</Badge>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )} 
      */}
    </div>
  );
}
