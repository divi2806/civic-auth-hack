import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Award, 
  Check, 
  X, 
  AlertCircle, 
  BookOpen, 
  Code, 
  Play,
  ExternalLink,
  ChevronRight,
  Twitter,
  Linkedin,
  Instagram,
  Share2,
  Coins
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/contexts/Web3Context";
import { useTasks } from "@/contexts/TaskContext";
import { verifyLeetcode } from "@/lib/mockData";
import { calculateLevelProgress, getStageEmoji, getStageColor } from "@/lib/web3Utils";
import { calculateTaskReward, getRewardRange, estimateTaskComplexity } from "@/lib/rewardUtils";
import { Task } from "@/types";
import { Link } from "react-router-dom";
import TaskQuiz from "@/components/quiz/TaskQuiz";

import MainLayout from "@/components/layout/MainLayout";
import RewardStats from "@/components/rewards/RewardStats";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isConnected, user, refreshUser, fetchTokenBalance, tokenBalance, address } = useWeb3();
  const { tasks, loading, addTask, completeTask, verifyTaskCompletion, deleteTask, getTaskTransactionLink } = useTasks();
  
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [verifyLeetcodeDialogOpen, setVerifyLeetcodeDialogOpen] = useState(false);
  const [verificationUsername, setVerificationUsername] = useState("");
  const [verifyingLeetcode, setVerifyingLeetcode] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [achievementToShare, setAchievementToShare] = useState<{
    title: string, 
    reward: number, 
    xpReward: number,
    transactionHash?: string
  }>({
    title: "",
    reward: 0,
    xpReward: 0
  });
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [currentQuizTask, setCurrentQuizTask] = useState<Task | null>(null);
  
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    type: "leetcode" | "course" | "video";
    url: string;
  }>({
    title: "",
    description: "",
    type: "leetcode",
    url: ""
  });
  
  // Get URL placeholder based on the selected task type
  const getUrlPlaceholder = (taskType: string) => {
    switch(taskType) {
      case "leetcode":
        return "https://leetcode.com/problems/contains-duplicate/";
      case "course":
        return "https://www.coursera.org/learn/machine-learning";
      case "video":
        return "https://www.youtube.com/watch?v=exampleId";
      default:
        return "https://example.com";
    }
  };
  
  // Get title placeholder based on the selected task type
  const getTitlePlaceholder = (taskType: string) => {
    switch(taskType) {
      case "leetcode":
        return "Solve LeetCode problem #217 - Contains Duplicate";
      case "course":
        return "Complete Machine Learning Fundamentals course";
      case "video":
        return "Watch System Design Interview video";
      default:
        return "Complete task";
    }
  };
  
  // Get description placeholder based on the selected task type
  const getDescriptionPlaceholder = (taskType: string) => {
    switch(taskType) {
      case "leetcode":
        return "Solve this array-based problem to practice hash set implementation";
      case "course":
        return "Complete all modules and quizzes in this foundational ML course";
      case "video":
        return "Learn best practices for system design by watching this tutorial";
      default:
        return "Add some details about your task...";
    }
  };
  
  // Use useEffect to navigate instead of doing it during render
  useEffect(() => {
    if (!isConnected || !user) {
      navigate("/");
    }
  }, [isConnected, user, navigate]);
  
  useEffect(() => {
    if (isConnected && user) {
      fetchTokenBalance();
    }
  }, [isConnected, user]);
  
  
  // Return early if not connected or no user, but AFTER the useEffect is defined
  if (!isConnected || !user) {
    return null;
  }
  
  const levelProgress = calculateLevelProgress(user.xp);
  
  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    const complexity = estimateTaskComplexity(newTask.title, newTask.description);
    const rewards = calculateTaskReward(newTask.type, complexity);
    
    const taskToAdd = {
      ...newTask,
      reward: rewards.tokens,
      xpReward: rewards.xp
    };
    
    addTask(taskToAdd);
    setNewTask({
      title: "",
      description: "",
      type: "leetcode",
      url: ""
    });
    setAddTaskDialogOpen(false);
    
    toast.success(`Task added with ${rewards.tokens} tokens and ${rewards.xp} XP reward!`, {
      description: "Complete the task to claim your rewards."
    });
  };
  
  const handleShareAchievement = (platform: string) => {
    const sharingBonus = 5;
    
    const shareMessage = `I just earned ${achievementToShare.reward} $TASK tokens and ${achievementToShare.xpReward} XP on InsightQuest by completing "${achievementToShare.title}"! #InsightQuest #LearnAndEarn`;
    
    let shareUrl = "";
    
    switch(platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(window.location.origin)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(shareMessage)}`;
        break;
      case "instagram":
        toast.info("Copy your achievement and share it on Instagram!");
        navigator.clipboard.writeText(shareMessage);
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: "InsightQuest Achievement",
            text: shareMessage,
            url: window.location.origin
          }).catch(err => console.error("Error sharing:", err));
        }
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
    
    toast.success(`Shared! You earned ${sharingBonus} bonus $TASK tokens!`);
    
    setShareDialogOpen(false);
  };
  
  const handleVerifyLeetcode = async () => {
    if (!verificationUsername.trim()) {
      toast.error("LeetCode username is required");
      return;
    }
    
    try {
      setVerifyingLeetcode(true);
      toast.info("Verifying LeetCode account...");
      
      // Get the wallet address from your Web3Context
      const walletAddress = address;
      
      if (!walletAddress) {
        toast.error("Wallet not connected");
        return;
      }
      
      console.log(`Attempting to verify LeetCode username: ${verificationUsername}`);
      
      // Call your FastAPI backend with proper headers
      const response = await fetch('http://localhost:8000/api/verify/leetcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${walletAddress}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: verificationUsername
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("LeetCode account verified successfully!");
        refreshUser();
        setVerifyLeetcodeDialogOpen(false);
      } else {
        toast.error(data.message || "Verification failed. Please check your username and try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.message || "An error occurred during verification");
      
      // If the primary method fails, try the alternative endpoint
      try {
        toast.info("Trying alternative verification method...");
        const walletAddress = address;
        
        const altResponse = await fetch('http://localhost:8000/api/verify/leetcode/alt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            username: verificationUsername,
            walletAddress: walletAddress
          })
        });
        
        if (!altResponse.ok) {
          const errorData = await altResponse.json();
          throw new Error(errorData.detail || `HTTP error! Status: ${altResponse.status}`);
        }
        
        const altData = await altResponse.json();
        
        if (altData.success) {
          toast.success("LeetCode account verified successfully!");
          refreshUser();
          setVerifyLeetcodeDialogOpen(false);
        } else {
          toast.error(altData.message || "Verification failed. Please check your username and try again.");
        }
      } catch (altError) {
        console.error("Alternative verification error:", altError);
        toast.error(altError.message || "All verification attempts failed. Please try again later.");
      }
    } finally {
      setVerifyingLeetcode(false);
    }
  };
  
  const handleTaskCompletion = async (taskId: string) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    
    if (!taskToComplete) return;
    
    // If it's a video or course task, show the quiz
    if (taskToComplete.type === "video" || taskToComplete.type === "course") {
      setCurrentQuizTask(taskToComplete);
      setQuizDialogOpen(true);
      return;
    }
    
    // Complete the task - but don't show sharing dialog yet
    await completeTask(taskId);
  };
  
  const handleVerifyTask = async (taskId: string) => {
    try {
      // Attempt to verify the task; if no error is thrown, verification is successful
      await verifyTaskCompletion(taskId);
      
      const verifiedTask = tasks.find(task => task.id === taskId);
      if (verifiedTask) {
        const txLink = getTaskTransactionLink(taskId);
        const txHash = txLink ? txLink.split('/').pop() : undefined;
        
        setAchievementToShare({
          title: verifiedTask.title,
          reward: verifiedTask.reward,
          xpReward: verifiedTask.xpReward,
          transactionHash: txHash
        });
        setShareDialogOpen(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed", {
        description: error.message || "An error occurred during verification."
      });
    }
  };
  
  const handleQuizSuccess = async () => {
    if (!currentQuizTask) return;
    
    try {
      // Complete the task
      await completeTask(currentQuizTask.id);
      
      // Show achievement popup after successful completion
      setAchievementToShare({
        title: currentQuizTask.title,
        reward: currentQuizTask.reward,
        xpReward: currentQuizTask.xpReward
      });
      setShareDialogOpen(true);
    } catch (error) {
      console.error("Task completion error:", error);
      toast.error("Failed to process completion", {
        description: error.message || "An error occurred during task completion."
      });
    }
  };
  
  const handleQuizFailure = () => {
    if (!currentQuizTask) return;
    
    toast.error("Quiz failed", {
      description: "You need to pass the quiz to earn rewards for this task."
    });
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Track your progress and complete tasks</p>
          </div>
          
          <div className="flex gap-3">
            {!user.leetcodeVerified ? (
              <Button 
                variant="outline" 
                className="gap-2 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                onClick={() => setVerifyLeetcodeDialogOpen(true)}
              >
                <Award className="h-4 w-4" />
                Verify LeetCode
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="gap-2 border-green-500/30 text-green-500 hover:bg-green-500/10 cursor-default"
              >
                <Check className="h-4 w-4" />
                LeetCode Verified: {user.leetcodeUsername}
              </Button>
            )}
            <Button 
              className="gap-2 purple-gradient"
              onClick={() => setAddTaskDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>
        
        <div className="mb-4 glass-card rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Coins className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Your $TASK Balance</p>
              <p className="text-xl font-bold text-yellow-400">{tokenBalance}</p>
            </div>
          </div>
          <Link 
            to="/leaderboard" 
            className="text-sm text-brand-purple flex items-center gap-1 hover:underline"
          >
            View Leaderboard
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="mb-8 glass-card rounded-lg p-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-3">
            <div>
              <p className="text-sm text-gray-400">Current Level</p>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                Level {user.level}
                <span className="text-sm text-gray-400 font-normal">({user.xp} XP)</span>
              </h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-brand-purple">
                {Math.floor(levelProgress)}% to Level {user.level + 1}
              </p>
            </div>
          </div>
          <Progress value={levelProgress} className="h-2 bg-gray-700">
            <div className="h-full bg-gradient-to-r from-brand-purple to-brand-purple-light rounded-full" />
          </Progress>
        </div>
        
        <div className="mb-8">
          <RewardStats user={user} />
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            {tasks.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-brand-purple hover:text-brand-purple-light"
                onClick={() => setAddTaskDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add New
              </Button>
            )}
          </div>
          
          {tasks.length === 0 ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center">
                  <PlusCircle className="h-8 w-8 text-brand-purple" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Tasks Yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Add your first task to start earning tokens and building your skills
              </p>
              <Button 
                className="purple-gradient"
                onClick={() => setAddTaskDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className="glass-card rounded-lg p-4 md:p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <TaskTypeIcon type={task.type} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-400">{task.description}</p>
                      
                      {task.url && (
                        <a 
                          href={task.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-brand-purple hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open Task URL
                        </a>
                      )}
                      
                      {/* Display transaction link if available */}
                      {task.status === 'verified' && getTaskTransactionLink(task.id) && (
                        <a 
                          href={getTaskTransactionLink(task.id)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 ml-4 inline-flex items-center gap-1 text-xs text-green-500 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Transaction
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {task.status === 'pending' ? (
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                          disabled={loading}
                          onClick={() => handleTaskCompletion(task.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {task.type === 'video' || task.type === 'course' 
                            ? 'Complete & Take Quiz' 
                            : 'Mark Complete'}
                        </Button>
                      ) : task.status === 'completed' ? (
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-brand-purple/30 text-brand-purple hover:bg-brand-purple/10"
                          disabled={loading}
                          onClick={() => handleVerifyTask(task.id)}
                        >
                          <Award className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">
                          <Check className="h-3 w-3" />
                          Verified
                        </div>
                      )}
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => deleteTask(task.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <Award className="h-3 w-3" />
                        <span>{task.reward} tokens</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-brand-purple">
                        <Award className="h-3 w-3" />
                        <span>{task.xpReward} XP</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {task.dateCreated ? new Date(task.dateCreated).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Dialog open={verifyLeetcodeDialogOpen} onOpenChange={setVerifyLeetcodeDialogOpen}>
  <DialogContent className="glass-card border-brand-purple/20">
    <DialogHeader>
      <DialogTitle>Verify Your LeetCode Account</DialogTitle>
      <DialogDescription>
        Add this verification token to your LeetCode bio to prove ownership.
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      <div className="glass-card bg-brand-dark-lighter/30 rounded-md p-4">
        <p className="text-sm text-gray-400 mb-2">Your verification token:</p>
        <div className="font-mono text-brand-purple font-semibold p-2 bg-brand-dark-lighter/50 rounded border border-brand-purple/20">
          {user.verificationToken || "IQTOKEN"}
        </div>
      </div>
      
      <ol className="space-y-3 text-sm text-gray-300">
        <li className="flex gap-2">
          <span className="text-brand-purple font-semibold">1.</span>
          <span>Go to your LeetCode profile page</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-purple font-semibold">2.</span>
          <span>Edit your profile</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-purple font-semibold">3.</span>
          <span>Add this verification token to your bio</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-purple font-semibold">4.</span>
          <span>Save your profile</span>
        </li>
      </ol>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-300">
          Your LeetCode Username
        </label>
        <Input 
          placeholder="leetcode_username" 
          value={verificationUsername}
          onChange={(e) => setVerificationUsername(e.target.value)}
        />
      </div>
    </div>
    
    <div className="flex justify-end gap-3">
      <Button
        variant="ghost"
        onClick={() => setVerifyLeetcodeDialogOpen(false)}
      >
        Cancel
      </Button>
      <Button
        className="purple-gradient"
        onClick={handleVerifyLeetcode}
        disabled={verifyingLeetcode}
      >
        {verifyingLeetcode ? "Verifying..." : "Verify Account"}
      </Button>
    </div>
  </DialogContent>
</Dialog>

<Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
  <DialogContent className="glass-card border-brand-purple/20">
    <DialogHeader>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogDescription>
        Create a new task to complete and earn rewards.
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm text-gray-300">
          Task Title
        </label>
        <Input 
          placeholder={getTitlePlaceholder(newTask.type)} 
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-300">
          Description
        </label>
        <Textarea 
          placeholder={getDescriptionPlaceholder(newTask.type)} 
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-300">
          Task Type
        </label>
        <Select 
          value={newTask.type} 
          onValueChange={(value: string) => setNewTask({ 
            ...newTask, 
            type: value as "leetcode" | "course" | "video" 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="leetcode">LeetCode Problem</SelectItem>
            <SelectItem value="course">Course</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-300">
          URL (optional)
        </label>
        <Input 
          placeholder={getUrlPlaceholder(newTask.type)} 
          value={newTask.url}
          onChange={(e) => setNewTask({ ...newTask, url: e.target.value })}
        />
        <p className="text-xs text-gray-500">
          System will automatically calculate token and XP rewards based on task complexity
        </p>
      </div>
    </div>
    
    <div className="flex justify-end gap-3">
      <Button
        variant="ghost"
        onClick={() => setAddTaskDialogOpen(false)}
      >
        Cancel
      </Button>
      <Button
        className="purple-gradient"
        onClick={handleAddTask}
      >
        Add Task
      </Button>
    </div>
  </DialogContent>
</Dialog>

<Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
  <DialogContent className="glass-card border-brand-purple/20">
    <DialogHeader>
      <DialogTitle>Achievement Unlocked! 🎉</DialogTitle>
      <DialogDescription>
        Share your achievement to earn 5 bonus $TASK tokens!
      </DialogDescription>
    </DialogHeader>
    
    <div className="py-4">
      <div className="glass-card bg-gradient-to-r from-brand-purple/20 to-brand-purple-dark/20 rounded-lg p-6 mb-4">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-brand-purple/20 flex items-center justify-center">
            <Award className="h-8 w-8 text-brand-purple" />
          </div>
        </div>
        
        <h3 className="text-center font-semibold text-xl mb-1">
          {achievementToShare.title}
        </h3>
        
        {/* Display transaction link if available */}
        {achievementToShare.transactionHash && (
          <a 
            href={`https://explorer.solana.com/tx/${achievementToShare.transactionHash}?cluster=devnet`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-1 text-xs text-green-500 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View Transaction on Solana
          </a>
        )}
        
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">Tokens</p>
            <p className="text-xl font-bold text-yellow-400">{achievementToShare.reward}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">XP</p>
            <p className="text-xl font-bold text-brand-purple">{achievementToShare.xpReward}</p>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-300 mb-4">Share on:</p>
      
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="w-10 h-10 rounded-full bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400"
          onClick={() => handleShareAchievement("twitter")}
        >
          <Twitter className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-blue-700/10 border-blue-700/20 hover:bg-blue-700/20 text-blue-600"
          onClick={() => handleShareAchievement("linkedin")}
        >
          <Linkedin className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-pink-600/10 border-pink-600/20 hover:bg-pink-600/20 text-pink-500"
          onClick={() => handleShareAchievement("instagram")}
        >
          <Instagram className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/20 text-gray-400"
          onClick={() => handleShareAchievement("other")}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
    
    <div className="flex justify-end">
      <Button
        variant="ghost"
        onClick={() => setShareDialogOpen(false)}
      >
        Maybe Later
      </Button>
    </div>
  </DialogContent>
</Dialog>
        
        {currentQuizTask && (
        <TaskQuiz
          task={currentQuizTask}
          open={quizDialogOpen}
          onOpenChange={setQuizDialogOpen}
          onSuccess={handleQuizSuccess}
          onFailure={handleQuizFailure}
        />
      )}
      </div>
    </MainLayout>
  );
};

const TaskTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'leetcode':
      return (
        <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center">
          <Code className="h-4 w-4 text-blue-500" />
        </div>
      );
    case 'course':
      return (
        <div className="w-8 h-8 rounded-md bg-green-500/20 flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-green-500" />
        </div>
      );
    case 'video':
      return (
        <div className="w-8 h-8 rounded-md bg-red-500/20 flex items-center justify-center">
          <Play className="h-4 w-4 text-red-500" />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-md bg-yellow-500/20 flex items-center justify-center">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </div>
      );
  }
};

export default Dashboard;
