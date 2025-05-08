
import { Brain, Star, Wallet } from "lucide-react";

const MissionSection = () => {
  return (
    <section className="py-16 bg-brand-dark-darker/70" id="mission">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-purple to-brand-purple-light" />
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-300">
                InsightQuest was founded with a simple but powerful mission: to transform learning into an engaging, rewarding experience in the Web3 era. We believe that knowledge acquisition should be incentivized, tracked, and celebrated.
              </p>
            </div>
            
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center shrink-0 mt-1">
                <Star className="h-6 w-6 text-brand-purple" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Incentivized Learning</h3>
                <p className="text-gray-400">
                  By rewarding users with tokens for completing educational tasks, we create a virtuous cycle that motivates continuous learning and skill development. These tokens represent not just a reward, but the value of insights gained.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center shrink-0 mt-1">
                <Wallet className="h-6 w-6 text-brand-purple" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Web3 Integration</h3>
                <p className="text-gray-400">
                  We leverage blockchain technology to provide transparent, verifiable records of learning achievements. Your accomplishments are yours to keep, showcasing your growth and dedication to potential employers and collaborators.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center shrink-0 mt-1">
                <Brain className="h-6 w-6 text-brand-purple" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Features</h3>
                <p className="text-gray-400">
                  Our platform leverages AI to verify task completion, provide personalized learning recommendations, and offer assistance through Zappy, our AI assistant that helps you brainstorm and stay focused.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
