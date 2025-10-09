import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Dummy API simulation
const analyzeSkinImage = async (imageUrl: string): Promise<any> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Random dummy responses
  const predictions = [
    {
      prediction: "Acne",
      confidence: 92.5,
      guidance:
        "Cleanse gently twice daily, avoid oily products, use mild topical treatments containing benzoyl peroxide or salicylic acid. Maintain a consistent skincare routine and avoid touching your face.",
    },
    {
      prediction: "Eczema",
      confidence: 87.3,
      guidance:
        "Keep skin moisturized with fragrance-free creams, avoid harsh soaps and hot water. Use prescribed corticosteroid creams as directed. Identify and avoid triggers like certain fabrics or stress.",
    },
    {
      prediction: "Rosacea",
      confidence: 79.8,
      guidance:
        "Protect from sun exposure, avoid spicy foods and alcohol, use gentle skincare products. Consider prescription treatments like metronidazole gel. Keep a diary to identify personal triggers.",
    },
    {
      prediction: "Psoriasis",
      confidence: 84.6,
      guidance:
        "Apply moisturizers frequently, use medicated creams as prescribed, consider phototherapy. Manage stress levels and maintain a healthy lifestyle. Avoid skin injuries that may trigger flare-ups.",
    },
    {
      prediction: "Melanoma (Early Stage)",
      confidence: 71.2,
      guidance:
        "URGENT: Schedule an immediate appointment with a dermatologist for professional evaluation. Early detection is crucial. Avoid sun exposure and monitor any changes in size, shape, or color.",
    },
  ];

  const result = predictions[Math.floor(Math.random() * predictions.length)];
  return { ...result, imageUrl };
};

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      handleScan(imageUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleScan = async (imageUrl: string) => {
    setIsScanning(true);
    toast.info("Analyzing your image...");

    try {
      const result = await analyzeSkinImage(imageUrl);
      toast.success("Analysis complete!");

      // Navigate to results page with data
      setTimeout(() => {
        navigate("/results", { state: result });
      }, 500);
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      setIsScanning(false);
      setSelectedImage(null);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="w-full py-16 px-4" id="upload-section">
      <div className="container mx-auto max-w-3xl">
        <Card
          className={`p-8 md:p-12 shadow-2xl transition-all duration-300 bg-gradient-to-b from-card to-card/95 ${
            isDragging ? "border-primary border-2 scale-[1.02]" : ""
          }`}
        >
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Upload Your Skin Image
            </h2>
            <p className="text-muted-foreground text-lg">
              Upload a clear photo of your skin concern for instant AI analysis
            </p>

            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/5 scale-105"
                  : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {isScanning ? (
                <div className="space-y-6 animate-pulse">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Loader2 className="h-24 w-24 text-primary animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-primary/20 animate-ping" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-primary">
                      Analyzing Your Image...
                    </p>
                    <p className="text-muted-foreground">
                      Please wait while our AI processes your image
                    </p>
                  </div>
                  {selectedImage && (
                    <div className="mt-6 max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={selectedImage}
                        alt="Uploaded"
                        className="w-full h-auto object-cover opacity-50"
                      />
                    </div>
                  )}
                </div>
              ) : selectedImage ? (
                <div className="space-y-4">
                  <div className="max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="mt-4"
                  >
                    Choose Different Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-6 bg-primary/10 rounded-full">
                      <ImageIcon className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-foreground">
                      Drag & Drop Your Image Here
                    </p>
                    <p className="text-muted-foreground">or</p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    className="gap-2"
                  >
                    <Upload className="h-5 w-5" />
                    Choose File
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 pt-8">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold text-foreground">Step 1</p>
                <p className="text-sm text-muted-foreground">Upload image</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold text-foreground">Step 2</p>
                <p className="text-sm text-muted-foreground">AI analyzes</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold text-foreground">Step 3</p>
                <p className="text-sm text-muted-foreground">View results</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ImageUpload;
