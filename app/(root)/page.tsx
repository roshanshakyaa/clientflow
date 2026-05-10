import { Feature } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero2 } from "@/components/sections/Hero";
import { Testimonials } from "@/components/sections/Testimonial";

export default function Home() {
  return (
    <>
      <Header />

      <Hero2 />
      <Testimonials />
      <Feature />
      <Footer />
    </>
  );
}
