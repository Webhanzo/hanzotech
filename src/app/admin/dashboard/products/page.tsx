// This page is now disabled as it depends on Firestore which has been removed.
// You can re-enable it if you connect it to a different data source.

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
// import { products } from '@/lib/products'; // Example for local data

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products: any[] = []; // Disabled

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Button asChild disabled>
          <Link href="/admin/dashboard/products/add">إضافة منتج جديد</Link>
        </Button>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>الوظيفة معطلة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            تم تعطيل إدارة المنتجات لأنه تم إزالة الاتصال بقاعدة البيانات.
          </p>
        </CardContent>
      </Card>

      {/* 
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.price.toLocaleString()} د.ع</TableCell>
                <TableCell>
                  {product.category === 'Laptops' ? 'لابتوب' : 'هاتف'}
                </TableCell>
                <TableCell>
                  {product.condition === 'New' ? 'جديد' : 'مستعمل'}
                </TableCell>
                <TableCell className="text-left">
                    <p>معطل</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> 
      */}
    </div>
  );
}
