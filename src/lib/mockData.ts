
import { User, Task, LeaderboardEntry } from "../types";
import { calculateLevel, calculateInsightValue, getRandomToken, getUserStage } from "./web3Utils";

// Mock users for testing
export const mockUsers: User[] = [
  {
    id: "1",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    username: "crypto_coder",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=crypto_coder",
    level: 5,
    xp: 2500,
    tokensEarned: 350,
    tokens: 350, // Added missing property
    timeSaved: 120,
    tasksCompleted: 42,
    insightValue: 1750, // 350 tokens * $5
    leetcodeVerified: true,
    leetcodeUsername: "crypto_coder",
    stage: "Glow"
  },
  {
    id: "2",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    username: "web3_dev",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=web3_dev",
    level: 7,
    xp: 4900,
    tokensEarned: 580,
    tokens: 580, // Added missing property
    timeSaved: 210,
    tasksCompleted: 65,
    insightValue: 2900,
    leetcodeVerified: true,
    leetcodeUsername: "web3_dev",
    stage: "Blaze"
  },
  {
    id: "3",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    username: "blockchain_builder",
    avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=blockchain_builder",
    level: 3,
    xp: 900,
    tokensEarned: 120,
    tokens: 120, // Added missing property
    timeSaved: 45,
    tasksCompleted: 18,
    insightValue: 600,
    leetcodeVerified: false,
    stage: "Spark"
  }
];

// Create more mock users for the leaderboard
export const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const baseUsers = mockUsers.map((user, index) => ({
    address: user.address,
    username: user.username,
    avatarUrl: user.avatarUrl,
    level: user.level,
    tokensEarned: user.tokensEarned,
    insightValue: user.insightValue,
    tasksCompleted: user.tasksCompleted,
    rank: index + 1,
    stage: user.stage
  }));

  // Add more mock users for the leaderboard
  const additionalUsers: LeaderboardEntry[] = Array.from({ length: 20 }, (_, i) => {
    const tokens = Math.floor(Math.random() * 800) + 50;
    const tasksCompleted = Math.floor(Math.random() * 100) + 10;
    const xp = Math.floor(Math.random() * 10000);
    const level = calculateLevel(xp);
    return {
      address: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      username: `web3_user_${i + 4}`,
      avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=user${i + 4}`,
      level: level,
      tokensEarned: tokens,
      insightValue: calculateInsightValue(tokens),
      tasksCompleted,
      rank: i + 4,
      stage: getUserStage(level)
    };
  });

  return [...baseUsers, ...additionalUsers].sort((a, b) => b.tokensEarned - a.tokensEarned)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
};

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: "1",
    userId: "1",
    title: "Solve LeetCode Problem #217: Contains Duplicate",
    description: "Solve this array-based algorithm problem on LeetCode",
    type: "leetcode",
    status: "completed",
    reward: 10,
    xpReward: 100,
    url: "https://leetcode.com/problems/contains-duplicate/",
    dateCreated: "2023-08-15T10:30:00Z",
    dateCompleted: "2023-08-15T14:45:00Z",
    platformId: "217",
  },
  {
    id: "2",
    userId: "1",
    title: "Complete Coursera Module on Blockchain Fundamentals",
    description: "Finish Module 3 of the Blockchain Specialization course",
    type: "course",
    status: "pending",
    reward: 25,
    xpReward: 250,
    url: "https://www.coursera.org/learn/blockchain-foundations-and-use-cases",
    dateCreated: "2023-08-16T09:15:00Z",
  },
  {
    id: "3",
    userId: "1",
    title: "Watch Video on Web3 Performance Optimization",
    description: "Learn techniques to optimize dApps for better performance",
    type: "video",
    status: "verified",
    reward: 15,
    xpReward: 150,
    url: "https://www.youtube.com/watch?v=example",
    dateCreated: "2023-08-14T16:20:00Z",
    dateCompleted: "2023-08-14T17:45:00Z",
  },
];

// Function to simulate LeetCode verification
export const verifyLeetcode = async (username: string, token: string): Promise<boolean> => {
  // This would call a real API in production
  console.log(`Verifying LeetCode for ${username} with token ${token}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 80% success rate
      resolve(Math.random() > 0.2);
    }, 1500);
  });
};

// Function to simulate task verification
export const verifyTask = async (task: Task): Promise<boolean> => {
  console.log(`Verifying task: ${task.title}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      resolve(Math.random() > 0.1);
    }, 2000);
  });
};

// Get the currently connected wallet address
export const getConnectedAddress = (): string | null => {
  // In a real app, this would get the address from Metamask
  return localStorage.getItem("connectedAddress");
};

// Set the connected wallet address
export const setConnectedAddress = (address: string): void => {
  localStorage.setItem("connectedAddress", address);
};

// Get the current user
export const getCurrentUser = (): User | null => {
  const address = getConnectedAddress();
  if (!address) return null;
  
  const user = mockUsers.find(u => u.address.toLowerCase() === address.toLowerCase());
  return user || null;
};

// Initialize a new user
export const initializeUser = (address: string): User => {
  const newUser: User = {
    id: Math.random().toString(36).substring(2, 10),
    address,
    level: 1,
    xp: 0,
    tokensEarned: 0,
    tokens: 0, // Added missing property
    timeSaved: 0,
    tasksCompleted: 0,
    insightValue: 0,
    leetcodeVerified: false,
    verificationToken: getRandomToken(),
    stage: "Spark"
  };
  
  mockUsers.push(newUser);
  return newUser;
};
