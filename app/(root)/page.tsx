import { Feature } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";
import { Hero2 } from "@/components/sections/Hero";
import { Testimonials } from "@/components/sections/Testimonial";

export default function Home() {
  return (
    <>
      <Hero2 />
      <Testimonials />
      <Feature />
      <Footer />
    </>
  );
}
