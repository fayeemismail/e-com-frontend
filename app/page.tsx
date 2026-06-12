import AnnouncementBar from "@/components/common/AnnouncementBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <FeaturedProducts />
    </>
  );
}
