import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function Shop() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <ShopClient />
      </Suspense>
    </div>
  );
}