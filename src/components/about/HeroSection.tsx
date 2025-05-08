
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/30 to-brand-dark-darker/90 z-0"></div>
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-brand-purple-light/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-brand-purple/10 rounded-full border border-brand-purple/20">
            <span className="text-brand-purple font-medium text-sm">Learn • Earn • Grow</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            About <span className="hero-gradient">InsightQuest</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10">
            Your gamified learning journey with blockchain-verified achievements and real rewards
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="purple-gradient" size="lg" asChild>
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#mission">
                Learn More
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
