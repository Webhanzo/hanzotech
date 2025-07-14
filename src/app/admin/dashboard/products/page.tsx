// src/app/admin/dashboard/products/page.tsx
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
import Image from 'next/image';
import ProductActions from './_components/product-actions';
import { getProducts } from '@/lib/firebase/database';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Button asChild>
          <Link href="/admin/dashboard/products/add">إضافة منتج جديد</Link>
        </Button>
      </div>

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
                  <ProductActions productId={product.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
