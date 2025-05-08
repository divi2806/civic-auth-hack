
import { Award, Brain, ChevronRight, Trophy, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";

const CTASection = () => {
  const { isConnected, connectWallet } = useWeb3();
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass-card rounded-xl max-w-4xl mx-auto p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Brain className="w-60 h-60 text-brand-purple" />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
                <p className="text-lg text-gray-300 mb-6">
                  Join InsightQuest today and transform your learning into rewards.
                </p>
                <div className="flex flex-wrap gap-4">
                  {isConnected ? (
                    <Button className="purple-gradient" size="lg" asChild>
                      <Link to="/dashboard">
                        Go to Dashboard
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button onClick={connectWallet} className="purple-gradient" size="lg">
                      Connect Wallet
                      <Wallet className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/leaderboard">
                      View Leaderboard
                      <Trophy className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="shrink-0">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark p-[3px] animate-pulse-glow">
                  <div className="w-full h-full rounded-full bg-brand-dark-darker flex items-center justify-center">
                    <Award className="h-20 w-20 text-brand-purple" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
