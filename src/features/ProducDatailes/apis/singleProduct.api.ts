import { ProductInterface } from "../../Products/interfaces/producy.inter";
type productItemRes = {
  data: ProductInterface;
};
export async function getSingleProduct(
  prodID: string,
): Promise<productItemRes> {
  try {
    const response = await fetch(
      `${process.env.PUBLIC_API}/products/${prodID}`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error();
    return response.json();
  } catch (error) {
    throw error;
  }
}
