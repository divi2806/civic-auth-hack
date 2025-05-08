// components/leaderboard/UserDetailsDialog.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Award,
  Clock,
  BookOpen,
  Code,
  Video,
  Calendar,
  Activity,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CheckCircle,
  ShoppingCart,
  Tag
} from "lucide-react";
import { LeaderboardEntry, UserActivity, UserTransaction } from "@/types";
import { shortenAddress } from "@/lib/web3Utils";

interface UserDetailsDialogProps {
  user: LeaderboardEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDetailsDialog = ({ user, open, onOpenChange }: UserDetailsDialogProps) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'transactions' | 'achievements'>('activities');
  const [userData, setUserData] = useState<{
    activities: UserActivity[];
    transactions: UserTransaction[];
    achievements: any[];
  }>({
    activities: [],
    transactions: [],
    achievements: []
  });
  
  useEffect(() => {
    if (user) {
      // Generate random data specific to this user based on their address as seed
      const seed = user.address.charCodeAt(2) + user.address.charCodeAt(5);
      setUserData({
        activities: generateRandomActivities(seed, user),
        transactions: generateRandomTransactions(seed, user),
        achievements: generateRandomAchievements(seed, user)
      });
    }
  }, [user]);
  
  if (!user) return null;
  
  // Generate activities based on user's stats
  function generateRandomActivities(seed: number, user: LeaderboardEntry): UserActivity[] {
    const activityCount = 5 + (seed % 5); // 5-9 activities
    const activities: UserActivity[] = [];
    
    // Make sure these activity types match what's in the UI rendering section
    const activityTypes = ['leetcode', 'video', 'course', 'contest', 'agent'];
    const leetcodeProblems = ['Two Sum', 'Merge Intervals', 'Valid Parentheses', 'LRU Cache', 'Binary Tree Traversal'];
    const videoCourses = ['Advanced React Patterns', 'Solidity for Beginners', 'Web3 Development', 'Data Structures', 'System Design'];
    const courses = ['Blockchain Fundamentals', 'Machine Learning Basics', 'Frontend Masters', 'Algorithm Design', 'Cloud Computing'];
    const contests = ['DeFi Hackathon', 'Coding Competition', 'AI Challenge', 'Web3 Buildathon', 'Data Science Cup'];
    
    // Use user's activity breakdown to determine frequency of different activity types
    const typeDistribution = user.activityBreakdown || {
      leetcode: 10,
      videos: 8,
      courses: 5,
      contests: 3,
      agents: 2
    };
    
    // Standardize keys for consistency (important fix)
    const standardizedDistribution = {
      leetcode: typeDistribution.leetcode || 0,
      video: typeDistribution.videos || 0,
      course: typeDistribution.courses || 0,
      contest: typeDistribution.contests || 0,
      agent: typeDistribution.agents || 0
    };
    
    const totalWeight = Object.values(standardizedDistribution).reduce((a, b) => a + b, 0);
    
    // Create a date for today to ensure we don't generate future activities
    const today = new Date();
    
    for (let i = 0; i < activityCount; i++) {
      // Weighted random selection of activity type
      let rand = Math.floor(Math.random() * totalWeight);
      let activityType = 'leetcode';
      
      let sum = 0;
      for (const [type, weight] of Object.entries(standardizedDistribution)) {
        sum += weight;
        if (rand < sum) {
          activityType = type;
          break;
        }
      }
      
      // Generate random date within last 30 days but not in the future
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      
      // Generate tokens earned based on activity type
      const tokensMap: Record<string, number> = {
        leetcode: 3 + Math.floor(Math.random() * 7),
        video: 2 + Math.floor(Math.random() * 4),
        course: 10 + Math.floor(Math.random() * 10),
        contest: 20 + Math.floor(Math.random() * 40),
        agent: 50 + Math.floor(Math.random() * 50)
      };
      
      const activity: UserActivity = {
        id: `act${i}-${seed}-${user.address.substring(2, 6)}`,
        type: activityType as any,
        title: 'Default Activity Title', // Default title
        description: 'Default activity description', // Default description
        date: date.toISOString(),
        tokensEarned: tokensMap[activityType] || 5,
        details: {} as any
      };
      
      // Set title, description and details based on activity type
      switch(activityType) {
        case 'leetcode':
          const problem = leetcodeProblems[Math.floor(Math.random() * leetcodeProblems.length)];
          const difficulty = ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)];
          activity.title = `Solved '${problem}' Problem`;
          activity.description = `Completed a LeetCode ${difficulty.toLowerCase()} problem`;
          activity.details = {
            difficulty,
            platform: 'LeetCode',
            problemId: `LC${1000 + Math.floor(Math.random() * 9000)}`
          };
          break;
        case 'video':
          const video = videoCourses[Math.floor(Math.random() * videoCourses.length)];
          activity.title = `Watched '${video}'`;
          activity.description = `Completed educational video series`;
          activity.details = {
            duration: `${15 + Math.floor(Math.random() * 46)} minutes`,
            creator: ['Frontend Masters', 'Crypto Academy', 'Tech University', 'CodeTube'][Math.floor(Math.random() * 4)],
            category: ['Web Development', 'Blockchain', 'AI', 'Data Science'][Math.floor(Math.random() * 4)]
          };
          break;
        case 'course':
          const course = courses[Math.floor(Math.random() * courses.length)];
          activity.title = `Completed '${course}'`;
          activity.description = `Finished all modules of the course`;
          activity.details = {
            progress: '100%',
            provider: ['Coursera', 'Udemy', 'edX', 'Khan Academy'][Math.floor(Math.random() * 4)],
            certificateId: `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          };
          break;
        case 'contest':
          const contest = contests[Math.floor(Math.random() * contests.length)];
          const rank = Math.floor(Math.random() * 10) + 1;
          const participants = 50 + Math.floor(Math.random() * 200);
          activity.title = `Participated in '${contest}'`;
          activity.description = `Ranked #${rank} in the competition`;
          activity.details = {
            rank,
            participants,
            category: ['Finance', 'Gaming', 'Education', 'Healthcare'][Math.floor(Math.random() * 4)]
          };
          break;
        case 'agent':
          activity.title = `Sold '${['Data Analysis', 'Code Review', 'Trading', 'Learning'][Math.floor(Math.random() * 4)]} Assistant' Agent`;
          activity.description = `Agent sold on marketplace`;
          activity.details = {
            buyer: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
            agentId: `AGT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            category: ['Productivity', 'Finance', 'Education', 'Entertainment'][Math.floor(Math.random() * 4)]
          };
          break;
        default:
          activity.title = `Unknown Activity`;
          activity.description = `Activity details not available`;
          break;
      }
      
      activities.push(activity);
    }
    
    // Sort by date (newest first)
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  // Generate transactions based on user's tokens earned
  function generateRandomTransactions(seed: number, user: LeaderboardEntry): UserTransaction[] {
    const txCount = Math.min(8, Math.max(4, Math.floor(user.tokensEarned / 20)));
    const transactions: UserTransaction[] = [];
    
    // Ensure total earnings match user's tokensEarned
    let totalEarnings = 0;
    let totalSpending = 0;
    
    // First generate earning transactions
    for (let i = 0; i < txCount - 2; i++) {
      const amount = 5 + Math.floor(Math.random() * 20);
      totalEarnings += amount;
      
      // Generate random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      transactions.push({
        id: `tx${i}-${seed}-${user.address.substring(2, 6)}`,
        type: 'earning',
        amount,
        date: date.toISOString(),
        description: [
          'Earned from LeetCode problem',
          'Earned from watching educational video',
          'Course completion reward',
          'Contest prize',
          'Sold AI agent on marketplace'
        ][Math.floor(Math.random() * 5)],
        source: [
          'Task Completion',
          'Learning',
          'Education',
          'Competition',
          'Agent Sale'
        ][Math.floor(Math.random() * 5)]
      });
    }
    
    // Then generate spending transactions
    for (let i = 0; i < 2; i++) {
      const amount = 5 + Math.floor(Math.random() * 20);
      totalSpending += amount;
      
      // Generate random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      transactions.push({
        id: `tx${txCount - 2 + i}-${seed}-${user.address.substring(2, 6)}`,
        type: 'spending',
        amount,
        date: date.toISOString(),
        description: [
          'Purchased access to premium course',
          'Contest entry fee',
          'Bought AI assistant credits',
          'Subscription renewal'
        ][Math.floor(Math.random() * 4)],
        source: [
          'Marketplace',
          'Competition',
          'Subscription',
          'Premium Content'
        ][Math.floor(Math.random() * 4)]
      });
    }
    
    // Add final adjustment transaction to match user's tokensEarned
    const finalAdjustment = user.tokensEarned - (totalEarnings - totalSpending);
    if (finalAdjustment !== 0) {
      transactions.push({
        id: `tx-adj-${seed}-${user.address.substring(2, 6)}`,
        type: finalAdjustment > 0 ? 'earning' : 'spending',
        amount: Math.abs(finalAdjustment),
        date: new Date().toISOString(),
        description: finalAdjustment > 0 ? 'Platform bonus' : 'Platform fee',
        source: 'System'
      });
    }
    
    // Sort by date (newest first)
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  // Generate achievements based on user's level and activity
  function generateRandomAchievements(seed: number, user: LeaderboardEntry) {
    const achievementCount = Math.min(6, Math.max(2, Math.floor(user.level / 8)));
    const achievements = [];
    
    const possibleAchievements = [
      {
        title: "Code Warrior",
        description: "Solved 50+ LeetCode problems",
        icon: "code",
        level: Math.min(3, Math.max(1, Math.floor(user.activityBreakdown?.leetcode || 0) / 10))
      },
      {
        title: "Contest Champion",
        description: "Won first place in a contest",
        icon: "trophy",
        level: Math.min(3, Math.max(1, Math.floor(user.activityBreakdown?.contests || 0) / 2))
      },
      {
        title: "Knowledge Seeker",
        description: "Watched 100+ educational videos",
        icon: "video",
        level: Math.min(3, Math.max(1, Math.floor(user.activityBreakdown?.videos || 0) / 7))
      },
      {
        title: "Agent Creator",
        description: "Created and sold 5+ AI agents",
        icon: "bot",
        level: Math.min(3, Math.max(1, Math.floor(user.activityBreakdown?.agents || 0) / 1))
      },
      {
        title: "Course Master",
        description: "Completed 10+ courses with distinction",
        icon: "book",
        level: Math.min(3, Math.max(1, Math.floor(user.activityBreakdown?.courses || 0) / 3))
      },
      {
        title: "Token Millionaire",
        description: "Earned over 1000 tokens lifetime",
        icon: "coin",
        level: Math.min(3, Math.max(1, Math.floor(user.tokensEarned / 50)))
      }
    ];
    
    // Shuffle and take first achievementCount items
    const shuffled = [...possibleAchievements].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, achievementCount);
    
    for (let i = 0; i < selected.length; i++) {
      const achievement = selected[i];
      
      // Generate random date within last 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      achievements.push({
        id: `ach${i}-${seed}-${user.address.substring(2, 6)}`,
        title: achievement.title,
        description: achievement.description,
        date: date.toISOString(),
        icon: achievement.icon,
        level: achievement.level
      });
    }
    
    return achievements;
  }
  
  // Calculate statistics
  const totalEarned = userData.transactions.filter(tx => tx.type === "earning").reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpent = userData.transactions.filter(tx => tx.type === "spending").reduce((sum, tx) => sum + tx.amount, 0);
  const netBalance = totalEarned - totalSpent;
  
  // Activity type icons - now matching the exact type values used in the activities
  const activityIcons = {
    leetcode: <Code className="h-4 w-4 text-blue-500" />,
    video: <Video className="h-4 w-4 text-red-500" />,
    course: <BookOpen className="h-4 w-4 text-green-500" />,
    contest: <Trophy className="h-4 w-4 text-yellow-500" />,
    agent: <ShoppingCart className="h-4 w-4 text-purple-500" />
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl overflow-hidden p-0">
        <div className="h-3 bg-brand-purple" />
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-brand-purple">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-2xl md:text-3xl mb-1">
                    {user.username || shortenAddress(user.address)}
                  </DialogTitle>
                  <div className="text-gray-400">{shortenAddress(user.address)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-brand-purple/20 text-brand-purple border-brand-purple/20">
                      Level {user.level}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                      {user.tasksCompleted} Tasks
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-brand-purple/10 rounded-lg p-4 min-w-[150px]">
                <Award className="h-5 w-5 text-yellow-400 mb-1" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{user.tokensEarned}</div>
                  <div className="text-sm text-gray-500">$TASK Tokens</div>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-brand-dark-lighter/30 p-4 rounded-lg flex flex-col items-center">
              <ArrowUpRight className="h-6 w-6 text-green-500 mb-2" />
              <div className="text-xl font-bold text-green-500">{totalEarned}</div>
              <div className="text-sm text-gray-500">Total Earned</div>
            </div>
            <div className="bg-brand-dark-lighter/30 p-4 rounded-lg flex flex-col items-center">
              <ArrowDownRight className="h-6 w-6 text-red-500 mb-2" />
              <div className="text-xl font-bold text-red-500">{totalSpent}</div>
              <div className="text-sm text-gray-500">Total Spent</div>
            </div>
            <div className="bg-brand-dark-lighter/30 p-4 rounded-lg flex flex-col items-center">
              <Coins className="h-6 w-6 text-yellow-400 mb-2" />
              <div className="text-xl font-bold text-yellow-400">{netBalance}</div>
              <div className="text-sm text-gray-500">Net Balance</div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="border-b border-gray-700 mb-6">
              <div className="flex space-x-6">
                <button
                  className={`pb-2 font-medium ${activeTab === 'activities' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('activities')}
                >
                  Activities
                </button>
                <button
                  className={`pb-2 font-medium ${activeTab === 'transactions' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('transactions')}
                >
                  Transactions
                </button>
                <button
                  className={`pb-2 font-medium ${activeTab === 'achievements' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('achievements')}
                >
                  Achievements
                </button>
              </div>
            </div>
            
            {activeTab === 'activities' && (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Activity className="h-5 w-5 mr-2 text-brand-purple" />
      Recent Activities
    </h3>
    
    <div className="relative">
      <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-brand-purple/20" />
      
      <div className="space-y-6">
        {userData.activities.map((activity) => (
          <div key={activity.id} className="relative pl-8">
            <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-brand-purple border-2 border-brand-dark" />
            
            <div className="bg-brand-dark-lighter/20 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {activity.type && activityIcons[activity.type] ? activityIcons[activity.type] : <Clock className="h-4 w-4 text-gray-500" />}
                  <span className="font-medium">{activity.title || "Unknown Activity"}</span>
                </div>
                <div className="flex items-center text-yellow-400">
                  <Award className="h-4 w-4 mr-1" />
                  <span>+{activity.tokensEarned || 0}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-2">{activity.description || "No description available"}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(activity.date)}</span>
                </div>
                
                {activity.type === 'leetcode' && activity.details && (
                  <Badge className="bg-blue-500/10 text-blue-400 text-xs">
                    {activity.details.difficulty || "Unknown"}
                  </Badge>
                )}
                
                {activity.type === 'contest' && activity.details && (
                  <Badge className="bg-yellow-500/10 text-yellow-400 text-xs">
                    Rank #{activity.details.rank || "?"}/{activity.details.participants || "?"}
                  </Badge>
                )}
                
                {activity.type === 'course' && activity.details && (
                  <Badge className="bg-green-500/10 text-green-400 text-xs">
                    {activity.details.progress || "0%"} Complete
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {userData.activities.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No activities found for this user
          </div>
        )}
      </div>
    </div>
  </div>
)}
            
            {activeTab === 'transactions' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-brand-purple" />
                  Token Transactions
                </h3>
                
                <div className="space-y-3">
                  {userData.transactions.map((tx) => (
                    <div key={tx.id} className="bg-brand-dark-lighter/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {tx.type === 'earning' ? (
                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                              <ArrowUpRight className="h-4 w-4 text-green-500" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                              <ArrowDownRight className="h-4 w-4 text-red-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{tx.description}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(tx.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold ${tx.type === 'earning' ? 'text-green-500' : 'text-red-500'}`}>
                          {tx.type === 'earning' ? '+' : '-'}{tx.amount}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-700/50 flex justify-between items-center">
                        <Badge className="bg-brand-dark text-gray-400 border-gray-700">
                          {tx.source}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          TX: {tx.id}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {userData.transactions.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No transactions found for this user
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Achievements & Badges
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-brand-dark-lighter/20 p-4 rounded-lg flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-full ${
                        achievement.level === 1 ? 'bg-yellow-500/20' : 
                        achievement.level === 2 ? 'bg-blue-500/20' : 'bg-purple-500/20'
                      } flex items-center justify-center`}>
                        {achievement.icon === 'code' && <Code className="h-6 w-6 text-blue-500" />}
                        {achievement.icon === 'trophy' && <Trophy className="h-6 w-6 text-yellow-500" />}
                        {achievement.icon === 'video' && <Video className="h-6 w-6 text-red-500" />}
                        {achievement.icon === 'bot' && <Tag className="h-6 w-6 text-purple-500" />}
                        {achievement.icon === 'book' && <BookOpen className="h-6 w-6 text-green-500" />}
                        {achievement.icon === 'coin' && <Coins className="h-6 w-6 text-yellow-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {achievement.title}
                          <Badge className={`text-xs ${
                            achievement.level === 1 ? 'bg-yellow-500/20 text-yellow-400' : 
                            achievement.level === 2 ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            Level {achievement.level}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">{achievement.description}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Unlocked {new Date(achievement.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {userData.achievements.length === 0 && (
                    <div className="text-center py-8 text-gray-400 col-span-2">
                      No achievements found for this user
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;