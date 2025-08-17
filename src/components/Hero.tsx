import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Download, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";


const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartBrowsing = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start browsing books",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    navigate('/books');
  };

  const handleUploadPDF = () => {
    if (!user) {
      toast({
        title: "Sign in required", 
        description: "Please sign in to upload PDFs",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    navigate('/dashboard');
  };
  return (
    <section className="relative bg-gradient-to-br from-gurukul-orange/10 to-gurukul-blue/10 py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Campus
                <span className="bg-gradient-to-r from-gurukul-orange to-gurukul-blue bg-clip-text text-transparent block sm:inline"> Book Hub</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Buy, sell, and share educational resources with fellow students. From textbooks to study guides, build your academic success together.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group w-full sm:w-auto" onClick={handleStartBrowsing}>
                Start Browsing
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={handleUploadPDF}>
                Upload Free PDF
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-gurukul-orange" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">1000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Books Listed</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Download className="h-5 w-5 sm:h-6 sm:w-6 text-gurukul-blue" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">500+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Free PDFs</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gurukul-green" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">2000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Students</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-first lg:order-last">
            <div className="absolute inset-0 bg-gradient-to-br from-gurukul-orange/20 to-gurukul-blue/20 rounded-2xl sm:rounded-3xl transform rotate-2 lg:rotate-3 shadow-xl"></div>
            <img
              src="/lovable-uploads/856e8997-9e1a-4c98-afea-9df6aff36111.png"
              alt="GurukulPustakalaya - Free book selling and buying platform for Nepali students"
              className="relative rounded-2xl sm:rounded-3xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;