import ProductClient from "@/components/product/ProductClient";

type Props = { params: Promise<{ id: string }> | { id: string } };

export default async function ProductPage({ params }: Props) {
  const { id } = await Promise.resolve(params);
  return <ProductClient id={id} />;
}
