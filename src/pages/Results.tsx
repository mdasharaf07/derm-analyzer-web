import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

interface ResultData {
  prediction: string;
  confidence: number;
  guidance: string;
  imageUrl: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const resultData = location.state as ResultData;

  useEffect(() => {
    if (!resultData) {
      navigate("/");
      return;
    }

    // Animate results in
    const timer = setTimeout(() => setShowResults(true), 300);
    return () => clearTimeout(timer);
  }, [resultData, navigate]);

  if (!resultData) return null;

  const isHighConfidence = resultData.confidence >= 75;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Upload New Image
        </Button>

        <div
          className={`transition-all duration-700 transform ${
            showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Card className="p-8 shadow-xl bg-gradient-to-b from-card to-card/95">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Analysis Complete
                </h1>
                <p className="text-muted-foreground">
                  AI-powered skin disease classification results
                </p>
              </div>

              {/* Uploaded Image */}
              <div className="flex justify-center">
                <div className="relative rounded-lg overflow-hidden shadow-lg max-w-md w-full">
                  <img
                    src={resultData.imageUrl}
                    alt="Analyzed skin"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Prediction */}
              <div className="text-center space-y-3 py-6 border-y border-border">
                <div className="flex items-center justify-center gap-2">
                  {isHighConfidence ? (
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                  )}
                  <h2 className="text-xl text-muted-foreground">
                    Predicted Condition
                  </h2>
                </div>
                <p className="text-4xl md:text-5xl font-bold text-primary">
                  {resultData.prediction}
                </p>
              </div>

              {/* Confidence Score */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    Confidence Level
                  </h3>
                  <span className="text-2xl font-bold text-primary">
                    {resultData.confidence.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={resultData.confidence}
                  className="h-3"
                  indicatorClassName={
                    isHighConfidence ? "bg-accent" : "bg-yellow-500"
                  }
                />
                <p className="text-sm text-muted-foreground text-center">
                  {isHighConfidence
                    ? "High confidence - Results are reliable"
                    : "Moderate confidence - Consider professional consultation"}
                </p>
              </div>

              {/* Recovery Guidance */}
              <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Recovery Guidance
                </h3>
                <p className="text-foreground/90 leading-relaxed">
                  {resultData.guidance}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="text-center text-sm text-muted-foreground bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  ⚠️ Medical Disclaimer
                </p>
                <p className="mt-2">
                  This is an AI-powered analysis tool and should not replace
                  professional medical advice. Please consult a dermatologist
                  for accurate diagnosis and treatment.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => navigate("/")}
                  size="lg"
                  className="px-8"
                >
                  Analyze Another Image
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;
