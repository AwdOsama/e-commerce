import { Suspense } from "react";
import RelatedProduct from "../RealatedProduct/RelatedProduct";
import { getSingleProduct } from "./apis/singleProduct.api";
import ProductDetailsView from "./ProductDetailsView";
import Loading from "@/src/app/Loading";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductdatailesCom({ params }: PageProps) {
  const { id } = await params;
  const { data: product } = await getSingleProduct(id);
  return (
    <ProductDetailsView
      product={product}
      relatedProducts={
        <Suspense fallback={<Loading />}>
          <RelatedProduct
            cID={product.category._id}
            currentProductId={product._id}
          />
        </Suspense>
      }
    />
  );
}
