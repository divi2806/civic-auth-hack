
import { Code, Shield, TrendingUp, Users } from "lucide-react";

const features = [
  {
    title: "Easy Integration",
    description: "Seamlessly integrate our API with your existing platforms like Slack, MS Teams, or custom web applications.",
    icon: Code,
    color: "bg-blue-500/20 text-blue-500",
  },
  {
    title: "Transparent Rewards",
    description: "All incentives are recorded on blockchain, providing complete transparency and eliminating discrepancies.",
    icon: Shield,
    color: "bg-green-500/20 text-green-500",
  },
  {
    title: "Increased Engagement",
    description: "Boost team productivity and motivation with gamified challenges and meaningful rewards.",
    icon: TrendingUp,
    color: "bg-brand-purple/20 text-brand-purple",
  },
  {
    title: "Team Collaboration",
    description: "Foster teamwork through shared goals, collaborative challenges, and community achievements.",
    icon: Users,
    color: "bg-amber-500/20 text-amber-500",
  },
];

const FeatureSection = () => {
  return (
    <div className="py-16 bg-brand-dark-darker">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Businesses Choose InsightQuest</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transform your team's productivity with our blockchain-powered incentive system
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="border border-brand-purple/10 bg-brand-dark-lighter/50 rounded-lg p-6 hover:border-brand-purple/30 transition-all duration-300 hover:shadow-md"
            >
              <div className={`${feature.color} p-3 rounded-lg inline-block mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
