
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, BookOpen, Award, Brain, Code, Play, Trophy, 
  Sparkles, Zap, Rocket, Star
} from "lucide-react";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { useWeb3 } from "@/contexts/Web3Context";
import { generateMockLeaderboard } from "@/lib/mockData";

const Index = () => {
  const { isConnected, connectWallet, address, refreshUser } = useWeb3();
  const navigate = useNavigate();
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  
  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);
  
  // If already connected, redirect to dashboard
  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
    
    // Trigger animations after page load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isConnected, navigate]);

  const leaderboard = generateMockLeaderboard().slice(0, 5);
  
  const handleConnectWallet = async () => {
    await connectWallet();
    setUsernameDialogOpen(true);
  };
  
  const saveUsername = () => {
    if (username.trim()) {
      // In a real app, we would save this to the user's profile
      localStorage.setItem(`username_${address}`, username);
      refreshUser();
    }
    setUsernameDialogOpen(false);
  };

  const skipUsername = () => {
    setUsernameDialogOpen(false);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,135,245,0.15)_0,transparent_70%)]" />
        <div className="absolute top-40 left-20 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-purple-700/5 blur-3xl animate-pulse" style={{animationDuration: '7s'}} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className={`max-w-2xl transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-brand-purple/30 bg-brand-purple/10">
                <div className="flex items-center gap-1.5 text-sm font-medium text-brand-purple">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Learn, Earn, and Level Up</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative">
                <span className="relative z-10 inline-block animate-entering text-white" style={{animationDelay: '0.1s'}}>Earn Rewards</span>{' '}
                <span className="relative z-10 inline-block animate-entering text-white" style={{animationDelay: '0.3s'}}>While</span>{' '}
                <span className="relative z-10 inline-block animate-entering text-white" style={{animationDelay: '0.5s'}}>Building Skills</span>
                <div className="absolute -bottom-4 left-0 w-32 h-2 bg-brand-purple rounded-full opacity-70"></div>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8 animate-entering" style={{animationDelay: '0.7s'}}>
                Complete learning challenges, solve problems, and watch educational content to earn tokens and insights. Track your progress and climb the leaderboard!
              </p>
              
              <div className="flex flex-wrap gap-4 animate-entering" style={{animationDelay: '0.9s'}}>
                <Button 
                  onClick={handleConnectWallet} 
                  size="lg"
                  className="purple-gradient relative overflow-hidden group"
                >
                  <span className="relative z-10">Connect Wallet to Start</span>
                  <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  className="border-brand-purple/30 hover:bg-brand-purple/10 transition-colors duration-300"
                >
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mt-8 animate-entering" style={{animationDelay: '1.1s'}}>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full border-2 border-brand-dark-darker overflow-hidden ring-2 ring-brand-purple/30"
                    >
                      <img 
                        src={`https://api.dicebear.com/6.x/avataaars/svg?seed=user${i}`} 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Join <span className="text-brand-purple font-medium">1,000+</span> users already earning rewards
                </p>
              </div>
            </div>
            
            <div className={`lg:w-2/5 transition-all duration-1000 ease-out delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative perspective">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple to-brand-purple-dark rounded-lg blur opacity-30 animate-pulse"></div>
                <div className="glass-card rounded-lg p-6 relative transform hover:rotate-y-5 hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      Top Earners
                    </h3>
                    <Link to="/leaderboard" className="text-sm text-brand-purple flex items-center gap-1 hover:underline">
                      View All
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {leaderboard.map((entry, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-4 p-3 rounded-md bg-brand-dark-lighter/30 hover:bg-brand-dark-lighter/50 transition-colors duration-200"
                      >
                        <div className="w-6 h-6 flex items-center justify-center font-medium text-sm">
                          {index + 1}
                        </div>
                        
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-brand-purple/20">
                          <img 
                            src={entry.avatarUrl || `https://api.dicebear.com/6.x/avataaars/svg?seed=${entry.address}`} 
                            alt={entry.username} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium truncate">{entry.username || `user${index + 1}`}</div>
                          <div className="text-xs text-gray-400">Level {entry.level}</div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Award className="h-4 w-4" />
                            <span className="font-bold">{entry.tokensEarned}</span>
                          </div>
                          <div className="text-xs text-green-400">${entry.insightValue}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-brand-dark-darker/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(155,135,245,0.05)_0,transparent_70%)]" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 hero-gradient inline-block relative">
              How InsightQuest Works
              <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent"></div>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Complete tasks, earn tokens, and gain valuable insights through a variety of learning activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Code className="h-6 w-6 text-blue-400" />}
              color="blue"
              title="Solve Coding Challenges"
              description="Complete LeetCode problems and challenges to earn tokens and improve your algorithm skills"
            />
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6 text-green-400" />}
              color="green"
              title="Complete Courses"
              description="Finish modules on platforms like Coursera and earn rewards for your dedication to learning"
            />
            <FeatureCard 
              icon={<Play className="h-6 w-6 text-red-400" />}
              color="red"
              title="Watch Educational Videos"
              description="Earn by watching curated videos on productivity, finance, technology, and more"
            />
            <FeatureCard 
              icon={<Trophy className="h-6 w-6 text-yellow-400" />}
              color="yellow"
              title="Climb the Leaderboard"
              description="Compete with others and track your progress as you earn more tokens"
            />
            <FeatureCard 
              icon={<Brain className="h-6 w-6 text-purple-400" />}
              color="purple"
              title="Build Real Skills"
              description="Tasks are designed to provide valuable insights and practical knowledge"
            />
            <FeatureCard 
              icon={<Award className="h-6 w-6 text-pink-400" />}
              color="pink"
              title="Earn Real Rewards"
              description="Exchange tokens for real-world benefits, discounts, and more"
            />
          </div>
        </div>
      </section>
      
      {/* Stages Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(155,135,245,0.1)_0,transparent_70%)]" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 hero-gradient">
              Your Journey to Mastery
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Progress through five stages of development as you learn and earn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <StageCard 
              icon={<Sparkles className="h-8 w-8 text-blue-400" />}
              name="Spark"
              description="The beginning of the journey, where the first signs of productivity light up"
              color="blue"
            />
            <StageCard 
              icon={<Star className="h-8 w-8 text-green-400" />}
              name="Glow"
              description="Gaining momentum, shining brighter with every task completed"
              color="green"
            />
            <StageCard 
              icon={<Zap className="h-8 w-8 text-orange-400" />}
              name="Blaze"
              description="Productivity is on fire, and tokens are flowing more frequently"
              color="orange"
            />
            <StageCard 
              icon={<Sparkles className="h-8 w-8 text-purple-400" />}
              name="Nova"
              description="A burst of high-level focus and consistency; standing out in the ecosystem"
              color="purple"
            />
            <StageCard 
              icon={<Rocket className="h-8 w-8 text-yellow-400" />}
              name="Orbit"
              description="Full flow, revolving at peak performance, maximizing both tasks and token gains"
              color="yellow"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/10 to-transparent" />
            <div className="absolute top-0 right-0 w-full h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-20 w-40 h-40 bg-brand-purple/5 rounded-full blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start Earning While Learning?
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Connect your wallet now and start completing tasks to earn tokens and climb the leaderboard.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleConnectWallet} size="lg" className="purple-gradient relative overflow-hidden group">
                    <span className="relative z-10">Connect Wallet</span>
                    <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="border-brand-purple/30 hover:bg-brand-purple/10 transition-all duration-300">
                    <Link to="/leaderboard">
                      View Leaderboard
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Username Dialog */}
      <Dialog open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
        <DialogContent className="glass-card border-brand-purple/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Welcome to InsightQuest!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-400 mb-4">Would you like to set a username for your profile?</p>
            <Input
              placeholder="Enter username (optional)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-2"
            />
            <p className="text-xs text-gray-500 text-center">You can always change this later</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
            <Button 
              variant="secondary" 
              onClick={skipUsername}
            >
              Skip for now
            </Button>
            <Button 
              className="purple-gradient"
              onClick={saveUsername}
            >
              Save Username
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "green" | "red" | "yellow" | "purple" | "pink";
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const bgColor = {
    blue: "bg-blue-500/10",
    green: "bg-green-500/10",
    red: "bg-red-500/10",
    yellow: "bg-yellow-500/10",
    purple: "bg-purple-500/10",
    pink: "bg-pink-500/10",
  }[color];
  
  const borderColor = {
    blue: "border-blue-500/20",
    green: "border-green-500/20",
    red: "border-red-500/20",
    yellow: "border-yellow-500/20",
    purple: "border-purple-500/20",
    pink: "border-pink-500/20",
  }[color];
  
  return (
    <div className={`glass-card rounded-lg p-6 card-hover border ${borderColor}`}>
      <div className={`h-12 w-12 rounded-lg ${bgColor} flex items-center justify-center mb-5`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

interface StageCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  color: "blue" | "green" | "orange" | "purple" | "yellow";
}

const StageCard = ({ icon, name, description, color }: StageCardProps) => {
  const bgColor = {
    blue: "bg-blue-500/5",
    green: "bg-green-500/5",
    orange: "bg-orange-500/5",
    purple: "bg-purple-500/5",
    yellow: "bg-yellow-500/5",
  }[color];

  const borderColor = {
    blue: "border-blue-500/20",
    green: "border-green-500/20",
    orange: "border-orange-500/20",
    purple: "border-purple-500/20",
    yellow: "border-yellow-500/20",
  }[color];

  const shadowColor = {
    blue: "shadow-blue-500/20",
    green: "shadow-green-500/20",
    orange: "shadow-orange-500/20",
    purple: "shadow-purple-500/20",
    yellow: "shadow-yellow-500/20",
  }[color];

  const textColor = {
    blue: "text-blue-400",
    green: "text-green-400",
    orange: "text-orange-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
  }[color];
  
  return (
    <div className={`glass-card rounded-lg p-6 border ${borderColor} hover:shadow-lg ${shadowColor} transition-all duration-300 text-center`}>
      <div className="flex justify-center mb-4">
        <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-xl font-bold mb-2 ${textColor}`}>{name}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default Index;
