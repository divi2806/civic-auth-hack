
export type User = {
  id: string;
  address: string;
  username?: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  tokensEarned: number;
  tokens: number;
  timeSaved: number;
  tasksCompleted: number;
  insightValue: number;
  leetcodeVerified: boolean;
  leetcodeUsername?: string;
  verificationToken?: string;
  stage: "Spark" | "Glow" | "Blaze" | "Nova" | "Orbit";
  lastLogin?: string;
  loginStreak?: number;
  signatureVerified: boolean;
  hasReceivedAirdrop: boolean;
  airdropTxSignature?: string;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: "leetcode" | "course" | "video";
  status: "pending" | "completed" | "verified";
  reward: number;
  xpReward: number;
  url?: string;
  dateCreated: string;
  dateCompleted?: string;
  platformId?: string;
};

export interface LeaderboardEntry {
  address: string;
  username?: string;
  avatarUrl: string;
  level: number;
  tokensEarned: number;
  tasksCompleted: number;
  insightValue: number;
  rank: number;
  stage: "Spark" | "Glow" | "Blaze" | "Nova" | "Orbit"; 
  activityBreakdown?: {
    leetcode: number;
    videos: number;
    courses: number;
    contests: number;
    agents: number;
  };
  joinDate?: string;
  lastActive?: string;
  streak?: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  ratingCount: number;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl: string;
  imageUrl: string;
  githubUrl?: string;
  downloadUrl?: string;
  purchasedBy?: string[];
  dateCreated: string;
  createdBy?: string; // Added this property to match usage in firebase.ts
  agentType: "ai" | "human"; // New field to distinguish between AI and human agents
  // Human agent specific fields
  experience?: string;
  location?: string;
  availability?: string;
  contactMethod?: string;
  qualifications?: string[];
}

export type ContestCategory = "coding" | "finance" | "productivity" | "learning";



export interface UserActivity {
  id: string;
  type: "leetcode" | "video" | "course" | "contest" | "agent";
  title: string;
  description: string;
  date: string;
  tokensEarned: number;
  details: any;
}

export interface UserTransaction {
  id: string;
  type: "earning" | "spending";
  amount: number;
  date: string;
  description: string;
  source: string;
}