import { getProducts } from "./apis/products.api";
import ProductItem from "./ProductItem";
import { LocalizedText } from "@/components/ui-preferences";

export default async function Product({ categoryId, brandId, keyword }: { categoryId?: string; brandId?: string; keyword?: string }) {
  const response = await getProducts(categoryId, brandId, keyword);
  const products = response.data ?? [];

  return (
    products.length > 0 ? (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {products.map((prod) => (
          <ProductItem key={prod.id || prod._id} prod={prod} />
        ))}
      </div>
    ) : (
      <p className="rounded-xl bg-muted p-6 text-muted-foreground">
        <LocalizedText k="noProducts" />
      </p>
    )
  );
}
