import Shop from "@/components/shop/Shop";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  await searchParams; // Awaiting searchParams opts the page into dynamic rendering at runtime
  return (
    <>
      <Shop />
    </>
  );
}
