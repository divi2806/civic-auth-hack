// pages/leaderboard.tsx
import { useState, useEffect } from "react";
import { 
  Trophy,
  Code,
  Video,
  BookOpen, 
  Award, 
  Search,
  Clock,
  CircleDollarSign,
  SortAsc,
  SortDesc,
  Users
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import MainLayout from "@/components/layout/MainLayout";
import { generateMockLeaderboard } from "@/lib/mockData";
import { LeaderboardEntry } from "@/types";
import { shortenAddress } from "@/lib/web3Utils";
import UserDetailsDialog from "@/components/UserDetailsDialog";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "tokensEarned",
    direction: "desc" as "asc" | "desc"
  });
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);

  useEffect(() => {
    // Load the leaderboard data with enhanced mock data
    const mockLeaderboard = generateEnhancedMockLeaderboard();
    setLeaderboard(mockLeaderboard);
    setFilteredLeaderboard(mockLeaderboard);
  }, []);

  useEffect(() => {
    const filtered = leaderboard.filter(entry => {
      const username = entry.username?.toLowerCase() || "";
      const address = entry.address.toLowerCase();
      const query = searchQuery.toLowerCase();
      return username.includes(query) || address.includes(query);
    });
    
    // Sort the filtered list
    const sorted = [...filtered].sort((a, b) => {
      // @ts-ignore
      const valueA = a[sortConfig.key];
      // @ts-ignore
      const valueB = b[sortConfig.key];
      
      if (valueA === valueB) {
        // Secondary sort by tokensEarned if values are equal
        return sortConfig.direction === "asc" 
          ? a.tokensEarned - b.tokensEarned
          : b.tokensEarned - a.tokensEarned;
      }
      
      return sortConfig.direction === "asc" 
        ? valueA - valueB 
        : valueB - valueA;
    });
    
    // Update ranks after sorting
    const rankedLeaderboard = sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
    
    setFilteredLeaderboard(rankedLeaderboard);
  }, [searchQuery, leaderboard, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "desc" ? "asc" : "desc"
    }));
  };
  
  const handleUserClick = (user: LeaderboardEntry) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
  };
  
  // Generate enhanced mock data with more details
  const generateEnhancedMockLeaderboard = (): LeaderboardEntry[] => {
    const baseLeaderboard = generateMockLeaderboard();
    
    // Add more detailed information to each entry
    return baseLeaderboard.map(entry => {
      // Use address as a seed for consistent randomization
      const seed = entry.address.charCodeAt(2) + entry.address.charCodeAt(5);
      
      // Generate random activity breakdown with some correlation to user's level
      // Higher level users tend to have more activity
      const levelFactor = entry.level / 50; // 0-1 scale based on level
      
      return {
        ...entry,
        // Add additional fields for the enhanced leaderboard
        activityBreakdown: {
          leetcode: Math.floor(Math.random() * 30 * (0.5 + levelFactor)),
          videos: Math.floor(Math.random() * 20 * (0.5 + levelFactor)),
          courses: Math.floor(Math.random() * 10 * (0.5 + levelFactor)),
          contests: Math.floor(Math.random() * 5 * (0.5 + levelFactor)),
          agents: Math.floor(Math.random() * 3 * (0.5 + levelFactor))
        },
        joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        lastActive: new Date(2025, 3, Math.floor(Math.random() * 20) + 1).toISOString(),
        streak: Math.floor(Math.random() * 30) + 1,
      };
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-gray-400">See who's earning the most rewards</p>
        </div>
        
        {/* Top 3 */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredLeaderboard.slice(0, 3).map((entry, index) => (
              <div 
                key={index} 
                className={`glass-card rounded-lg p-6 text-center ${index === 0 ? "purple-glow" : ""} cursor-pointer hover:bg-brand-purple/10 transition-colors`}
                onClick={() => handleUserClick(entry)}
              >
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <div 
                      className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                        index === 0 ? "border-yellow-400" : 
                        index === 1 ? "border-gray-400" : "border-amber-700"
                      }`}
                    >
                      <Avatar className="w-full h-full">
                        <AvatarImage src={entry.avatarUrl} />
                        <AvatarFallback>{entry.username?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div 
                      className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? "bg-yellow-400" : 
                        index === 1 ? "bg-gray-400" : "bg-amber-700"
                      }`}
                    >
                      {entry.rank}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-1">{entry.username || shortenAddress(entry.address)}</h3>
                <p className="text-sm text-gray-400 mb-3">{shortenAddress(entry.address)}</p>
                
                <div className="flex justify-center gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Level</p>
                    <p className="font-bold text-brand-purple">{entry.level}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Tasks</p>
                    <p className="font-bold">{entry.tasksCompleted}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-lg font-bold text-yellow-400">
                  <Award className="h-5 w-5" />
                  <span>{entry.tokensEarned}</span>
                </div>
                
                {/* Activity breakdown preview */}
                <div className="mt-4 pt-4 border-t border-brand-purple/10">
                  <div className="text-xs text-gray-400 mb-2">Token Sources</div>
                  <div className="flex justify-center space-x-3">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                        <Code className="h-3 w-3 text-blue-500" />
                      </div>
                      <span className="text-xs">{entry.activityBreakdown?.leetcode || 0}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center mb-1">
                        <Video className="h-3 w-3 text-red-500" />
                      </div>
                      <span className="text-xs">{entry.activityBreakdown?.videos || 0}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center mb-1">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                      </div>
                      <span className="text-xs">{entry.activityBreakdown?.contests || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Search & Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-10" 
              placeholder="Search by username or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="tokens" className="w-full sm:w-72">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="level">Level</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="value">Value</TabsTrigger>
            </TabsList>
            <TabsContent value="tokens" className="hidden">
              Sorting by tokens earned
            </TabsContent>
            <TabsContent value="level" className="hidden">
              Sorting by level achieved
            </TabsContent>
            <TabsContent value="tasks" className="hidden">
              Sorting by tasks completed
            </TabsContent>
            <TabsContent value="value" className="hidden">
              Sorting by insight value
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Main Leaderboard */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-brand-purple/10">
                  <th className="py-3 px-4 text-left">Rank</th>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 flex items-center gap-1"
                      onClick={() => handleSort("level")}
                    >
                      Level
                      {sortConfig.key === "level" && (
                        sortConfig.direction === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 flex items-center gap-1"
                      onClick={() => handleSort("tokensEarned")}
                    >
                      Tokens
                      {sortConfig.key === "tokensEarned" && (
                        sortConfig.direction === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 flex items-center gap-1"
                      onClick={() => handleSort("insightValue")}
                    >
                      Value
                      {sortConfig.key === "insightValue" && (
                        sortConfig.direction === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 flex items-center gap-1"
                      onClick={() => handleSort("tasksCompleted")}
                    >
                      Tasks
                      {sortConfig.key === "tasksCompleted" && (
                        sortConfig.direction === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-center">Activity</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.map((entry) => (
                  <tr 
                    key={entry.address} 
                    className="border-b border-brand-purple/10 hover:bg-brand-purple/5 cursor-pointer"
                    onClick={() => handleUserClick(entry)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {entry.rank <= 3 ? (
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            entry.rank === 1 ? "bg-yellow-400" : 
                            entry.rank === 2 ? "bg-gray-400" : "bg-amber-700"
                          } text-black`}>
                            {entry.rank}
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center text-xs">
                            {entry.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.avatarUrl} />
                          <AvatarFallback className="bg-brand-dark-lighter text-brand-purple">
                            {entry.username?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {entry.username || shortenAddress(entry.address)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {shortenAddress(entry.address)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant="outline" className="bg-brand-purple/10 text-brand-purple border-brand-purple/20">
                        {entry.level}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1 text-yellow-400">
                        <Award className="h-4 w-4" />
                        <span className="font-medium">{entry.tokensEarned}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1 text-green-500">
                        <CircleDollarSign className="h-4 w-4" />
                        <span className="font-medium">${entry.insightValue}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{entry.tasksCompleted}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        {entry.activityBreakdown?.leetcode > 0 && (
                          <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center" title="LeetCode">
                            <Code className="h-3 w-3 text-blue-500" />
                          </div>
                        )}
                        {entry.activityBreakdown?.videos > 0 && (
                          <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center" title="Videos">
                            <Video className="h-3 w-3 text-red-500" />
                          </div>
                        )}
                        {entry.activityBreakdown?.courses > 0 && (
                          <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center" title="Courses">
                            <BookOpen className="h-3 w-3 text-green-500" />
                          </div>
                        )}
                        {entry.activityBreakdown?.contests > 0 && (
                          <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center" title="Contests">
                            <Trophy className="h-3 w-3 text-yellow-500" />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredLeaderboard.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No users found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* User Details Dialog */}
      <UserDetailsDialog 
        user={selectedUser}
        open={userDetailsOpen}
        onOpenChange={setUserDetailsOpen}
      />
    </MainLayout>
  );
};

export default Leaderboard;
