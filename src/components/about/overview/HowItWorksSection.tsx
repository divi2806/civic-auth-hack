
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { ChevronRight, Wallet } from "lucide-react";

const HowItWorksSection = () => {
  const { isConnected, connectWallet } = useWeb3();
  
  return (
    <section className="py-16 bg-brand-dark-darker/70">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 hero-gradient">How InsightQuest Works</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our platform makes it easy to track learning progress, verify task completion, and earn rewards for your dedication
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-8 mb-8">
            <ol className="space-y-8">
              <li className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center shrink-0 mt-1">
                  <span className="text-brand-purple font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-400 mb-3">
                    Start by connecting your Web3 wallet to our platform. We support MetaMask and other popular wallets, ensuring your rewards are securely stored.
                  </p>
                  {!isConnected && (
                    <Button 
                      onClick={connectWallet} 
                      className="gap-2 purple-gradient"
                    >
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </li>
              
              <li className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center shrink-0 mt-1">
                  <span className="text-brand-purple font-medium">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Add Learning Tasks</h3>
                  <p className="text-gray-400">
                    Create tasks based on your learning goals. Whether it's coding challenges on LeetCode, courses on platforms like Coursera, or educational videos, add them to your dashboard.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center shrink-0 mt-1">
                  <span className="text-brand-purple font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete & Verify Tasks</h3>
                  <p className="text-gray-400">
                    After completing a task, mark it as done on your dashboard. Our verification system will confirm your achievement through API integrations or AI-based verification.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center shrink-0 mt-1">
                  <span className="text-brand-purple font-medium">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Earn Rewards & Level Up</h3>
                  <p className="text-gray-400">
                    Receive tokens and XP for verified completions. As you accumulate XP, you'll level up on our platform, unlocking additional benefits and recognition.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
