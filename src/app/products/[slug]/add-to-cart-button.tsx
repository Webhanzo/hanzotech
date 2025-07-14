'use client';

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-provider";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `تمت إضافة "${product.name}" إلى سلة التسوق الخاصة بك.`,
      className: 'bg-accent text-accent-foreground border-0',
    });
  };

  return (
    <Button size="lg" onClick={handleAddToCart}>
      <ShoppingCart className="me-2 h-5 w-5" />
      أضف إلى السلة
    </Button>
  );
}
