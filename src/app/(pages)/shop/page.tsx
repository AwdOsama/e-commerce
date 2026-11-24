import Product from "@/src/features/Products/product";
import { Suspense } from "react";
import Loading from "../../Loading";

type ShopSearchParams = Promise<{ category?: string | string[]; brand?: string | string[]; keyword?: string | string[] }>;

async function ShopProducts({ searchParams }: { searchParams: ShopSearchParams }) {
  const params = await searchParams;
  const categoryId = Array.isArray(params.category) ? params.category[0] : params.category;
  const brandId = Array.isArray(params.brand) ? params.brand[0] : params.brand;
  const keyword = Array.isArray(params.keyword) ? params.keyword[0] : params.keyword;

  return <Product categoryId={categoryId} brandId={brandId} keyword={keyword} />;
}

export default function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  return (
    <main className=" container py-8 sm:py-12">
      <Suspense fallback={<Loading />}>
        <ShopProducts searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
