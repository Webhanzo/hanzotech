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
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Button asChild>
          <Link href="/admin/dashboard/products/add">إضافة منتج جديد</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">الصورة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead className="hidden md:table-cell">السعر</TableHead>
                <TableHead className="hidden lg:table-cell">الفئة</TableHead>
                <TableHead className="hidden lg:table-cell">الحالة</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.price.toLocaleString()} د.أ</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.category === 'Laptops' ? 'لابتوب' : 'هاتف'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
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
    </div>
  );
}
