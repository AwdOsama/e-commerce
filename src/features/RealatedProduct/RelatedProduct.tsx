import ProductItem from "../Products/ProductItem";
import { getRelatdeProducts } from "./api/realatedProduct.api";
import { LocalizedText } from "@/components/ui-preferences";

type RelatedProductProps = {
  cID: string;
  currentProductId: string;
};

export default async function RelatedProduct({
  cID,
  currentProductId,
}: RelatedProductProps) {
  const res = await getRelatdeProducts(cID);
  const relatedProducts = res.data
    .filter((prod) => prod._id !== currentProductId)
    .slice(0, 5);

  return relatedProducts.length > 0 ? (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {relatedProducts.map((prod) => (
        <ProductItem key={prod.id || prod._id} prod={prod} />
      ))}
    </div>
  ) : (
    <p className="rounded-xl bg-card p-5 text-muted-foreground">
      <LocalizedText k="noRelated" />
    </p>
  );
}
