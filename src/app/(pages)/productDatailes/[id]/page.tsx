import Loading from "@/src/app/Loading";
import ProductdatailesCom from "@/src/features/ProducDatailes/product.datailes";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ProductdatailesCom params={params} />
    </Suspense>
  );
}
