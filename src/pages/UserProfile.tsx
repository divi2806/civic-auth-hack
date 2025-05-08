import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Award, 
  Check, 
  Clock, 
  DollarSign, 
  Edit, 
  User as UserIcon,
  Star,
  Sparkles,
  Zap,
  Rocket,
  CircleDollarSign,
  Copy
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import { useWeb3 } from "@/contexts/Web3Context";
import { shortenAddress, calculateLevelProgress, getStageEmoji, getStageColor } from "@/lib/web3Utils";
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";

const UserProfile = () => {
  const navigate = useNavigate();
  const { isConnected, user, address, updateUsername } = useWeb3();
  const civicUser = useUser();
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  
  // Redirect if not connected
  if (!isConnected || !user) {
    navigate("/");
    return null;
  }
  
  const levelProgress = calculateLevelProgress(user.xp);
  const stageEmoji = getStageEmoji(user.stage);
  const stageColorClass = getStageColor(user.stage);
  
  // Get wallet address from Civic Auth if available
  const walletAddress = userHasWallet(civicUser) ? civicUser.solana.address : address;
  
  const handleSaveUsername = () => {
    if (newUsername.trim()) {
      updateUsername(newUsername.trim());
    }
    setEditingUsername(false);
  };

  const copyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success("Wallet address copied to clipboard");
    }
  };

  // Get stage icon
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "Spark": return <Sparkles className="h-5 w-5" />;
      case "Glow": return <Star className="h-5 w-5" />;
      case "Blaze": return <Zap className="h-5 w-5" />;
      case "Nova": return <Sparkles className="h-5 w-5" />;
      case "Orbit": return <Rocket className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };
  
  // Calculate stats
  const statsData = [
    { label: "Tokens Earned", value: user.tokensEarned, icon: <Award className="h-5 w-5 text-yellow-400" /> },
    { label: "Tasks Completed", value: user.tasksCompleted, icon: <Check className="h-5 w-5 text-green-400" /> },
    { label: "Time Saved", value: `${user.timeSaved} hrs`, icon: <Clock className="h-5 w-5 text-blue-400" /> },
    { label: "Insight Value", value: `$${user.insightValue}`, icon: <CircleDollarSign className="h-5 w-5 text-pink-400" /> },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400">Manage your profile and view your stats</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Panel */}
          <div className="col-span-1">
            <div className="glass-card rounded-lg p-6 h-full">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 border-2 border-brand-purple/30 ring-4 ring-brand-purple/10 mb-4">
                  <AvatarImage src={civicUser.user?.picture || user.avatarUrl} />
                  <AvatarFallback className="text-xl bg-brand-dark-lighter text-brand-purple">
                    {user.username?.[0] || civicUser.user?.name?.[0] || user.address?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {!editingUsername ? (
                      <h2 className="text-xl font-bold">
                        {user.username || civicUser.user?.name || shortenAddress(walletAddress || "")}
                      </h2>
                    ) : (
                      <span className="text-xl font-bold">
                        {shortenAddress(walletAddress || "")}
                      </span>
                    )}
                    <button 
                      onClick={() => setEditingUsername(!editingUsername)}
                      className="text-gray-400 hover:text-brand-purple"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex justify-center">
                    <Badge variant="outline" className={`${stageColorClass} border-opacity-30 flex items-center gap-1`}>
                      {stageEmoji} {user.stage}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Wallet Info */}
              <div className="bg-brand-dark-lighter/30 rounded-md p-4 mb-6">
                <div className="text-sm font-medium text-gray-400 mb-1">Wallet Address</div>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm break-all">{walletAddress}</div>
                  <button 
                    onClick={copyAddressToClipboard}
                    className="text-gray-400 hover:text-brand-purple p-1"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Level Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Level</span>
                  <span className="font-bold text-lg">{user.level}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span>XP: {user.xp}</span>
                  <span>{Math.floor(levelProgress)}% to Level {user.level + 1}</span>
                </div>
                
                <Progress value={levelProgress} className="h-2 bg-gray-700">
                  <div className="h-full bg-gradient-to-r from-brand-purple to-brand-purple-light rounded-full" />
                </Progress>
              </div>
            </div>
          </div>
          
          {/* Stats and Progress */}
          <div className="col-span-1 md:col-span-2">
            <div className="glass-card rounded-lg p-6 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4">Stats & Progress</h2>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {statsData.map((stat, idx) => (
                  <div key={idx} className="glass-card rounded-md p-4 border border-brand-purple/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand-dark-lighter/70 flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                        <div className="font-bold text-lg">{stat.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress Path */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Progress Path</h3>
                <div className="relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-dark-lighter transform -translate-y-1/2"></div>
                  
                  <div className="flex justify-between relative z-10">
                    <StageNode 
                      stage="Spark" 
                      isActive={user.stage === "Spark"} 
                      isPast={["Glow", "Blaze", "Nova", "Orbit"].includes(user.stage)} 
                      icon={<Sparkles className="h-4 w-4" />}
                      color="blue"
                    />
                    
                    <StageNode 
                      stage="Glow" 
                      isActive={user.stage === "Glow"} 
                      isPast={["Blaze", "Nova", "Orbit"].includes(user.stage)} 
                      icon={<Star className="h-4 w-4" />}
                      color="green"
                    />
                    
                    <StageNode 
                      stage="Blaze" 
                      isActive={user.stage === "Blaze"} 
                      isPast={["Nova", "Orbit"].includes(user.stage)} 
                      icon={<Zap className="h-4 w-4" />}
                      color="orange"
                    />
                    
                    <StageNode 
                      stage="Nova" 
                      isActive={user.stage === "Nova"} 
                      isPast={["Orbit"].includes(user.stage)} 
                      icon={<Sparkles className="h-4 w-4" />}
                      color="purple"
                    />
                    
                    <StageNode 
                      stage="Orbit" 
                      isActive={user.stage === "Orbit"} 
                      isPast={[].includes(user.stage)} 
                      icon={<Rocket className="h-4 w-4" />}
                      color="yellow" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Username Edit Dialog */}
      <Dialog open={editingUsername} onOpenChange={setEditingUsername}>
        <DialogContent className="glass-card border-brand-purple/20">
          <DialogHeader>
            <DialogTitle>Edit Username</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setEditingUsername(false)}
            >
              Cancel
            </Button>
            <Button 
              className="purple-gradient"
              onClick={handleSaveUsername}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

interface StageNodeProps {
  stage: string;
  isActive: boolean;
  isPast: boolean;
  icon: React.ReactNode;
  color: "blue" | "green" | "orange" | "purple" | "yellow";
}

const StageNode = ({ stage, isActive, isPast, icon, color }: StageNodeProps) => {
  const bgColorActive = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
  }[color];
  
  const bgColorInactive = {
    blue: "bg-blue-500/20",
    green: "bg-green-500/20",
    orange: "bg-orange-500/20",
    purple: "bg-purple-500/20",
    yellow: "bg-yellow-500/20",
  }[color];
  
  const textColor = {
    blue: "text-blue-500",
    green: "text-green-500",
    orange: "text-orange-500",
    purple: "text-purple-500",
    yellow: "text-yellow-500",
  }[color];
  
  return (
    <div className="flex flex-col items-center">
      <div className={`h-8 w-8 rounded-full flex items-center justify-center
        ${isActive ? bgColorActive : isPast ? bgColorActive : bgColorInactive}
        ${isActive ? "ring-4 ring-opacity-50" : ""}
        ${isActive ? `ring-${color}-500/30` : ""}`}
      >
        {icon}
      </div>
      <div className={`mt-2 text-xs font-medium ${isActive || isPast ? textColor : "text-gray-500"}`}>
        {stage}
      </div>
    </div>
  );
};

export default UserProfile;
