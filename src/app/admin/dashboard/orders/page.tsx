// src/app/admin/dashboard/orders/page.tsx
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';
  import { Badge } from '@/components/ui/badge';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { getOrders } from '@/lib/firebase/database';
  
  export const dynamic = 'force-dynamic';
  
  export default async function AdminOrdersPage() {
    const orders = await getOrders();
    // Sort orders by timestamp, newest first
    const sortedOrders = orders.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
    return (
      <div className="p-4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold">طلبات العملاء</h1>
        {sortedOrders.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>لا توجد طلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">لم يتم تسجيل أي طلبات بعد.</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {sortedOrders.map((order) => (
              <AccordionItem value={order.id} key={order.id} className="rounded-lg border bg-card">
                <AccordionTrigger className="p-6">
                  <div className='flex flex-col text-start'>
                    <CardTitle>{order.fullName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.phoneNumber}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="space-y-4">
                    <div>
                      <p><strong>تاريخ الطلب:</strong> {new Date(order.timestamp).toLocaleString()}</p>
                      <p><strong>طريقة الاستلام:</strong> {order.deliveryMethod === 'delivery' ? 'توصيل' : 'استلام'}</p>
                      {order.deliveryMethod === 'delivery' && (
                        <>
                          <p><strong>المدينة:</strong> {order.city}</p>
                          <p><strong>أقرب معلم:</strong> {order.landmark}</p>
                        </>
                      )}
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="mb-2 font-semibold">المنتجات المطلوبة:</h4>
                      <div className="space-y-2">
                        {order.items && order.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                            </div>
                            <Badge variant="secondary">{(item.price * item.quantity).toLocaleString()} د.أ</Badge>
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
      </div>
    );
  }