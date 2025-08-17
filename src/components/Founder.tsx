import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Founder = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Founder Image */}
            <div className="relative order-first lg:order-first flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-gurukul-orange/20 to-gurukul-blue/20 rounded-2xl transform rotate-3 shadow-xl"></div>
                <img
                  src="/lovable-uploads/6ba0cade-c829-4173-9132-78fde08365a2.png"
                  alt="Simon Tajpuriya - Founder of Gurukul Pustakalaya"
                  className="relative rounded-2xl shadow-2xl w-full h-full object-cover border-4 border-background"
                />
              </div>
            </div>

            {/* Founder Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-gurukul-orange/10 text-gurukul-orange rounded-full text-sm font-medium">
                  Meet Our Founder
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  Simon Tajpuriya
                </h2>
                <p className="text-lg text-muted-foreground font-medium">
                  Founder & CEO, Gurukul Pustakalaya
                </p>
              </div>

              <blockquote className="relative">
                <div className="absolute -top-4 -left-2 text-6xl text-gurukul-orange/20 font-serif">"</div>
                <p className="text-lg sm:text-xl text-foreground leading-relaxed relative z-10 pl-6">
                  As the founder of Gurukul Pustakalaya, I started this platform to make books affordable, accessible, and to inspire a culture of sharing knowledge in Nepal. My mission is to empower the youth to learn, connect, and create opportunities through reading and entrepreneurship.
                </p>
                <div className="absolute -bottom-4 -right-2 text-6xl text-gurukul-blue/20 font-serif transform rotate-180">"</div>
              </blockquote>

              <div className="pt-4 space-y-4">
                <div className="w-12 h-1 bg-gradient-to-r from-gurukul-orange to-gurukul-blue mx-auto lg:mx-0"></div>
                
                <div className="flex justify-center lg:justify-start">
                  <Button variant="outline" size="lg" asChild className="group">
                    <a href="tel:+9779824911482" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 group-hover:animate-pulse" />
                      <span className="font-medium">Contact: +977 9824911482</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;