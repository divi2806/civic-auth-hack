
import { Agent } from "@/types";

// Mock AI Agents data
export const mockAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Code Reviewer Pro",
    description: "An AI agent that reviews your code and provides suggestions for improvements, best practices, and potential bugs.",
    category: "Code Assistant",
    price: 250,
    rating: 4.8,
    ratingCount: 124,
    creatorId: "user-1",
    creatorName: "devgenius",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=devgenius",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=code-review",
    githubUrl: "https://github.com/example/code-reviewer-pro",
    downloadUrl: "#",
    purchasedBy: ["user-2", "user-3"],
    dateCreated: "2025-03-15T10:30:00.000Z"
  },
  {
    id: "agent-2",
    name: "Data Visualizer",
    description: "Transform your complex data into beautiful, interactive visualizations with this AI assistant.",
    category: "Data Analysis",
    price: 300,
    rating: 4.6,
    ratingCount: 89,
    creatorId: "user-2",
    creatorName: "datawhiz",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=datawhiz",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=data-viz",
    githubUrl: "https://github.com/example/data-visualizer",
    downloadUrl: "#",
    purchasedBy: ["user-1"],
    dateCreated: "2025-03-10T14:45:00.000Z"
  },
  {
    id: "agent-3",
    name: "LeetCode Coach",
    description: "Your personal AI coach for solving LeetCode problems. Get hints, explanations, and optimization suggestions.",
    category: "Code Assistant",
    price: 180,
    rating: 4.9,
    ratingCount: 205,
    creatorId: "user-3",
    creatorName: "algomaster",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=algomaster",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=leetcode",
    githubUrl: "https://github.com/example/leetcode-coach",
    downloadUrl: "#",
    purchasedBy: [],
    dateCreated: "2025-02-28T09:15:00.000Z"
  },
  {
    id: "agent-4",
    name: "Zappy Text Generator",
    description: "Generate creative, engaging text for blogs, social media, and marketing materials.",
    category: "Text Processing",
    price: 120,
    rating: 4.5,
    ratingCount: 78,
    creatorId: "user-4",
    creatorName: "wordsmith",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=wordsmith",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=text-gen",
    githubUrl: "",
    downloadUrl: "#",
    purchasedBy: ["user-1", "user-2", "user-5"],
    dateCreated: "2025-03-05T11:20:00.000Z"
  },
  {
    id: "agent-5",
    name: "ImageGenius",
    description: "Create stunning AI-generated images from text descriptions. Perfect for designers and content creators.",
    category: "Image Generation",
    price: 350,
    rating: 4.7,
    ratingCount: 156,
    creatorId: "user-5",
    creatorName: "artbot",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=artbot",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=image-gen",
    githubUrl: "https://github.com/example/image-genius",
    downloadUrl: "#",
    purchasedBy: ["user-3"],
    dateCreated: "2025-03-20T15:00:00.000Z"
  },
  {
    id: "agent-6",
    name: "ChatPro AI",
    description: "A customizable chatbot that can be trained on your specific data to provide customer support or information.",
    category: "Chatbot",
    price: 200,
    rating: 4.4,
    ratingCount: 67,
    creatorId: "user-6",
    creatorName: "chatmaster",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=chatmaster",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=chat-pro",
    githubUrl: "https://github.com/example/chatpro-ai",
    downloadUrl: "#",
    purchasedBy: ["user-2"],
    dateCreated: "2025-03-18T13:10:00.000Z"
  },
  // New agents
  {
    id: "agent-7",
    name: "Trading Assistant",
    description: "Advanced AI for cryptocurrency and stock market analysis with real-time insights and portfolio optimization.",
    category: "Finance",
    price: 500,
    rating: 4.9,
    ratingCount: 87,
    creatorId: "user-7",
    creatorName: "cryptotrader",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=cryptotrader",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=finance-bot",
    githubUrl: "https://github.com/example/trading-assistant",
    downloadUrl: "#",
    purchasedBy: ["user-1"],
    dateCreated: "2025-03-25T11:20:00.000Z"
  },
  {
    id: "agent-8",
    name: "Study Buddy",
    description: "Your personal AI tutor for any subject. Get explanations, practice questions, and customized learning paths.",
    category: "Education",
    price: 150,
    rating: 4.7,
    ratingCount: 203,
    creatorId: "user-8",
    creatorName: "edutech",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=edutech",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=study-buddy",
    githubUrl: "https://github.com/example/study-buddy",
    downloadUrl: "#",
    purchasedBy: ["user-3", "user-5"],
    dateCreated: "2025-03-12T09:40:00.000Z"
  },
  {
    id: "agent-9",
    name: "Productivity Planner",
    description: "AI assistant that helps you organize tasks, manage your calendar, and optimize your workflow for maximum efficiency.",
    category: "Productivity",
    price: 220,
    rating: 4.5,
    ratingCount: 112,
    creatorId: "user-9",
    creatorName: "taskmaster",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=taskmaster",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=productivity",
    githubUrl: "https://github.com/example/productivity-planner",
    downloadUrl: "#",
    purchasedBy: [],
    dateCreated: "2025-03-17T14:30:00.000Z"
  },
  {
    id: "agent-10",
    name: "Health Coach",
    description: "Personalized AI health assistant for nutrition advice, workout plans, and habit tracking to help you reach your wellness goals.",
    category: "Health & Fitness",
    price: 280,
    rating: 4.6,
    ratingCount: 94,
    creatorId: "user-10",
    creatorName: "fitpro",
    creatorAvatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=fitpro",
    imageUrl: "https://api.dicebear.com/6.x/bottts/svg?seed=health-coach",
    githubUrl: "https://github.com/example/health-coach",
    downloadUrl: "#",
    purchasedBy: ["user-2", "user-4"],
    dateCreated: "2025-03-21T10:15:00.000Z"
  }
];
