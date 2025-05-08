
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, Calendar, Coins, CheckCircle, Clock, Target, Sparkles, Award, InfoIcon } from "lucide-react";
import { ContestCategory } from "@/components/contests/ContestCard";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import ContestJoinModal from "./ContestJoinModal";

interface Contest {
  id: string;
  title: string;
  description: string;
  category: ContestCategory;
  entryFee: number;
  prizePool: number;
  participants: number;
  endDate: string;
  featured: boolean; // Changed from optional to required
  difficulty?: "beginner" | "intermediate" | "advanced";
  requirements?: string[];
  prizes?: {
    position: string;
    amount: number;
  }[];
  rules?: string[];
  judges?: {
    name: string;
    avatar: string;
    role: string;
  }[];
  milestones?: {
    date: string;
    title: string;
    description: string;
  }[];
}

interface ContestDetailsDialogProps {
  contest: Contest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContestDetailsDialog = ({ contest, open, onOpenChange }: ContestDetailsDialogProps) => {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const { user } = useWeb3();
  
  if (!contest) return null;
  
  // Calculate time remaining
  const endDate = new Date(contest.endDate);
  const now = new Date();
  const timeRemaining = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
  
  // Default prizes if not provided
  const prizes = contest.prizes || [
    { position: "1st Place", amount: Math.floor(contest.prizePool * 0.5) },
    { position: "2nd Place", amount: Math.floor(contest.prizePool * 0.3) },
    { position: "3rd Place", amount: Math.floor(contest.prizePool * 0.15) },
    { position: "Participation", amount: Math.floor(contest.prizePool * 0.05) }
  ];
  
  // Default difficulty
  const difficulty = contest.difficulty || (
    contest.entryFee < 30 ? "beginner" : 
    contest.entryFee < 60 ? "intermediate" : "advanced"
  );
  
  // Default requirements
  const requirements = contest.requirements || [
    "Active InsightQuest account",
    "Sufficient $TASK balance for entry fee",
    `Experience in ${contest.category}`
  ];
  
  // Default rules
  const rules = contest.rules || [
    "All submissions must be original work",
    "Participants must follow the guidelines provided",
    "Judging decisions are final",
    "Winners will be announced within 7 days of contest end"
  ];
  
  // Default judges
  const judges = contest.judges || [
    { name: "Alex Morgan", avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=alex", role: "Lead Judge" },
    { name: "Jamie Lee", avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=jamie", role: "Technical Expert" },
    { name: "Sam Wilson", avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=sam", role: "Industry Advisor" }
  ];
  
  // Default milestones
  const milestones = contest.milestones || [
    { 
      date: new Date(new Date(contest.endDate).setDate(endDate.getDate() - 21)).toISOString().split('T')[0], 
      title: "Registration Deadline", 
      description: "Last day to register for the contest"
    },
    { 
      date: new Date(new Date(contest.endDate).setDate(endDate.getDate() - 14)).toISOString().split('T')[0], 
      title: "Checkpoint 1", 
      description: "Submit initial progress for feedback"
    },
    { 
      date: new Date(new Date(contest.endDate).setDate(endDate.getDate() - 7)).toISOString().split('T')[0], 
      title: "Checkpoint 2", 
      description: "Submit refined work based on feedback"
    },
    { 
      date: contest.endDate, 
      title: "Final Submission", 
      description: "Deadline for all contest submissions"
    }
  ];
  
  const categoryColors: Record<ContestCategory, string> = {
    coding: "bg-blue-500",
    finance: "bg-green-500",
    productivity: "bg-purple-500",
    learning: "bg-amber-500",
  };
  
  const difficultyColors = {
    beginner: "bg-green-500 text-green-50",
    intermediate: "bg-yellow-500 text-yellow-50",
    advanced: "bg-red-500 text-red-50"
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl overflow-hidden p-0">
          <div className={`h-3 ${categoryColors[contest.category]}`} />
          <div className="p-6">
            <DialogHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className={categoryColors[contest.category]}>
                      {contest.category.charAt(0).toUpperCase() + contest.category.slice(1)}
                    </Badge>
                    <Badge className={difficultyColors[difficulty]}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Badge>
                    {contest.featured && <Badge className="bg-amber-500">Featured</Badge>}
                  </div>
                  <DialogTitle className="text-2xl md:text-3xl mb-1">{contest.title}</DialogTitle>
                  <DialogDescription className="text-base">
                    {contest.description}
                  </DialogDescription>
                </div>
                <div className="flex flex-col items-center justify-center bg-brand-purple/10 rounded-lg p-4 min-w-[150px]">
                  <Clock className="h-5 w-5 text-brand-purple mb-1" />
                  <div className="text-center">
                    <div className="text-xl font-bold">{daysRemaining}</div>
                    <div className="text-sm text-gray-500">Days Left</div>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-brand-dark-lighter/30 p-4 rounded-lg flex flex-col items-center">
                <Trophy className="h-6 w-6 text-amber-500 mb-2" />
                <div className="text-xl font-bold">{contest.prizePool} $TASK</div>
                <div className="text-sm text-gray-500">Prize Pool</div>
              </div>
              <div className="bg-brand-dark-lighter/30 p-4 rounded-lg flex flex-col items-center">
                <Coins className="h-6 w-6 text-brand-purple mb-2" />
                <div className="text-xl font-bold">{contest.entryFee} $TASK</div>
                <div className="text-sm text-gray-500">Entry Fee</div>
              </div>
              <div className="bg-brand-dark-lighter/30 p-4 rounded-lg flex flex-col items-center">
                <Users className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-xl font-bold">{contest.participants}</div>
                <div className="text-sm text-gray-500">Participants</div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />
                  Prizes
                </h3>
                <div className="space-y-4">
                  {prizes.map((prize, index) => (
                    <div key={index} className="flex items-center justify-between bg-brand-dark-lighter/20 p-3 rounded-lg">
                      <div className="flex items-center">
                        {index === 0 && (
                          <div className="mr-3 h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                            <Trophy className="h-4 w-4" />
                          </div>
                        )}
                        {index === 1 && (
                          <div className="mr-3 h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                            <Trophy className="h-4 w-4" />
                          </div>
                        )}
                        {index === 2 && (
                          <div className="mr-3 h-8 w-8 rounded-full bg-amber-700 flex items-center justify-center text-white">
                            <Trophy className="h-4 w-4" />
                          </div>
                        )}
                        {index > 2 && (
                          <div className="mr-3 h-8 w-8 rounded-full bg-brand-purple/30 flex items-center justify-center text-white">
                            <Award className="h-4 w-4" />
                          </div>
                        )}
                        <span className="font-medium">{prize.position}</span>
                      </div>
                      <div className="font-bold flex items-center">
                        <span>{prize.amount}</span>
                        <span className="text-xs ml-1 text-gray-400">$TASK</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-500" />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center">
                  <InfoIcon className="h-5 w-5 mr-2 text-orange-500" />
                  Rules
                </h3>
                <ul className="space-y-2">
                  {rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-bold text-orange-500 mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-red-400" />
                  Timeline
                </h3>
                <div className="relative">
                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-brand-purple/20" />
                  
                  <div className="space-y-6">
                    {milestones.map((milestone, index) => {
                      const milestoneDate = new Date(milestone.date);
                      const isPast = milestoneDate < now;
                      const isToday = milestoneDate.toDateString() === now.toDateString();
                      
                      return (
                        <div key={index} className="relative pl-8">
                          <div className={`absolute left-0 top-0 h-5 w-5 rounded-full border-2 ${
                            isPast 
                              ? "bg-brand-purple border-brand-purple" 
                              : isToday 
                              ? "bg-blue-500 border-blue-500" 
                              : "bg-transparent border-brand-purple"
                          }`} />
                          <div className="text-sm text-gray-400">{new Date(milestone.date).toLocaleDateString()}</div>
                          <div className="font-medium">{milestone.title}</div>
                          <div className="text-sm text-gray-500">{milestone.description}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  Judges
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {judges.map((judge, index) => (
                    <div key={index} className="text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-2">
                        <AvatarImage src={judge.avatar} />
                        <AvatarFallback>{judge.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{judge.name}</div>
                      <div className="text-sm text-gray-500">{judge.role}</div>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                  Participation Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-brand-dark-lighter/20 p-3 rounded-lg">
                    <div className="font-medium mb-1">XP Rewards</div>
                    <div className="text-sm text-gray-400">Earn XP for participation regardless of winning</div>
                  </div>
                  <div className="bg-brand-dark-lighter/20 p-3 rounded-lg">
                    <div className="font-medium mb-1">Skill Development</div>
                    <div className="text-sm text-gray-400">Improve your skills through practical challenges</div>
                  </div>
                  <div className="bg-brand-dark-lighter/20 p-3 rounded-lg">
                    <div className="font-medium mb-1">Feedback</div>
                    <div className="text-sm text-gray-400">Get expert feedback on your submissions</div>
                  </div>
                  <div className="bg-brand-dark-lighter/20 p-3 rounded-lg">
                    <div className="font-medium mb-1">Community</div>
                    <div className="text-sm text-gray-400">Connect with others in your field</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button 
                size="lg"
                className="purple-gradient px-8" 
                onClick={() => setJoinModalOpen(true)}
              >
                <Trophy className="mr-2 h-5 w-5" />
                Enter Contest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <ContestJoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        contest={contest}
        onJoin={() => Promise.resolve()}
      />
    </>
  );
};

export default ContestDetailsDialog;
