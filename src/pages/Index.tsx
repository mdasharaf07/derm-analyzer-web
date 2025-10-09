import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import Footer from "@/components/Footer";

const Index = () => {
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const handleStartScanning = () => {
    uploadSectionRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "center"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeroSection onStartScanning={handleStartScanning} />
      <div ref={uploadSectionRef}>
        <ImageUpload />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
