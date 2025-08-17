import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Founder from "@/components/Founder";
import Categories from "@/components/Categories";
import FeaturedBooks from "@/components/FeaturedBooks";
import PDFLibrary from "@/components/PDFLibrary";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <FeaturedBooks />
      <PDFLibrary />
      <Founder />
      <Footer />
    </div>
  );
};

export default Index;
