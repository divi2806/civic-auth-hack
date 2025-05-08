import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc, setDoc, orderBy, limit } from "firebase/firestore";
import { Agent, User, Task } from "@/types";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnDfjtEFJDEzp8hTLzbiiMl12UiO0Apwc",
  authDomain: "fir-auth-ccbfc.firebaseapp.com",
  projectId: "fir-auth-ccbfc",
  storageBucket: "fir-auth-ccbfc.firebasestorage.app",
  messagingSenderId: "506766226261",
  appId: "1:506766226261:web:dbfdcafb20bb5f3c2f75dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collections
const usersCollection = collection(db, "users");
const agentsCollection = collection(db, "agents");
const chatMessagesCollection = collection(db, "chatMessages");
const contestsCollection = collection(db, "contests");
const quizAttemptsCollection = collection(db, "quizAttempts");

// Helper to check wallet authentication
const checkWalletAuth = () => {
  // Check if we have a Web3 wallet address in localStorage
  const walletAddress = localStorage.getItem('connectedAddress');
  if (walletAddress) {
    return walletAddress.toLowerCase(); // Normalize address to lowercase
  }
  
  throw new Error("User not authenticated with MetaMask");
};

// Get user by wallet address
export const getUser = async (userId: string) => {
  try {
    // Normalize the user ID (wallet address) to lowercase
    const normalizedId = userId.toLowerCase();
    
    const userDoc = doc(db, "users", normalizedId);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data() as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

// Save user with wallet address as ID
export const saveUser = async (user: User) => {
  try {
    // Normalize the address to lowercase
    const normalizedAddress = user.address.toLowerCase();
    user.address = normalizedAddress;
    
    // Use the normalized address as document ID
    const userDoc = doc(usersCollection, normalizedAddress);
    await setDoc(userDoc, { ...user, id: normalizedAddress }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving user:", error);
    return false;
  }
};

export const updateUserXP = async (userId: string, xpToAdd: number) => {
  try {
    const normalizedId = userId.toLowerCase();
    const userDoc = doc(usersCollection, normalizedId);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as User;
      const currentXP = userData.xp || 0;
      const newXP = currentXP + xpToAdd;
      const oldLevel = userData.level;
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
      
      await updateDoc(userDoc, {
        xp: newXP,
        level: newLevel
      });
      
      return {
        success: true,
        oldXP: currentXP,
        newXP,
        oldLevel,
        newLevel
      };
    }
    
    return { success: false };
  } catch (error) {
    console.error("Error updating user XP:", error);
    return { success: false };
  }
};

// Agent functions
export const saveAgent = async (agent: Agent) => {
  try {
    const walletAddress = checkWalletAuth();
    
    // Add creator's wallet address to creatorId instead of createdBy
    agent.creatorId = walletAddress;
    
    if (agent.id) {
      // Update existing agent
      const agentDoc = doc(agentsCollection, agent.id);
      await setDoc(agentDoc, agent, { merge: true });
    } else {
      // Add new agent with generated ID
      await addDoc(agentsCollection, {
        ...agent,
        dateCreated: new Date().toISOString(),
        purchasedBy: agent.purchasedBy || []
      });
    }
    return true;
  } catch (error) {
    console.error("Error saving agent:", error);
    return false;
  }
};

export const getAgents = async () => {
  try {
    const querySnapshot = await getDocs(agentsCollection);
    const agents: Agent[] = [];
    
    querySnapshot.forEach((doc) => {
      const agent = { id: doc.id, ...doc.data() } as Agent;
      agents.push(agent);
    });
    
    return agents;
  } catch (error) {
    console.error("Error getting agents:", error);
    return [];
  }
};

export const purchaseAgent = async (agentId: string, userId: string) => {
  try {
    const walletAddress = checkWalletAuth();
    
    const agentDoc = doc(agentsCollection, agentId);
    await updateDoc(agentDoc, {
      purchasedBy: arrayUnion(walletAddress)
    });
    return true;
  } catch (error) {
    console.error("Error purchasing agent:", error);
    return false;
  }
};

// Chat message functions
export interface ChatMessage {
  id?: string;
  userId: string;
  sender: "user" | "zappy";
  content: string;
  timestamp: string;
}

export const saveChatMessage = async (message: ChatMessage) => {
  try {
    const walletAddress = checkWalletAuth();
    
    await addDoc(chatMessagesCollection, {
      ...message,
      userId: walletAddress, // Ensure the userId is the wallet address
      timestamp: message.timestamp || new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving chat message:", error);
    return false;
  }
};

export const getUserChatHistory = async (userId: string) => {
  try {
    const normalizedId = userId.toLowerCase();
    
    const q = query(
      chatMessagesCollection, 
      where("userId", "==", normalizedId),
      orderBy("timestamp", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const messages: ChatMessage[] = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
    });
    
    return messages;
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
};

// Quiz attempt functions
export interface QuizAttempt {
  id?: string;
  userId: string;
  taskId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptNumber: number;
  timestamp: string;
  reward?: number;  // Added the reward property
  txHash?: string;  // Added the txHash property
}

export const saveQuizAttempt = async (attempt: QuizAttempt) => {
  try {
    const walletAddress = checkWalletAuth();
    
    await addDoc(quizAttemptsCollection, {
      ...attempt,
      userId: walletAddress, // Ensure the userId is the wallet address
      timestamp: attempt.timestamp || new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving quiz attempt:", error);
    return false;
  }
};

export const getQuizAttempts = async (userId: string, taskId: string) => {
  try {
    const normalizedId = userId.toLowerCase();
    
    const q = query(
      quizAttemptsCollection,
      where("userId", "==", normalizedId),
      where("taskId", "==", taskId),
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const attempts: QuizAttempt[] = [];
    
    querySnapshot.forEach((doc) => {
      attempts.push({ id: doc.id, ...doc.data() } as QuizAttempt);
    });
    
    return attempts;
  } catch (error) {
    console.error("Error getting quiz attempts:", error);
    return [];
  }
};

export const getLatestQuizAttempt = async (userId: string, taskId: string) => {
  try {
    const normalizedId = userId.toLowerCase();
    
    const q = query(
      quizAttemptsCollection,
      where("userId", "==", normalizedId),
      where("taskId", "==", taskId),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as QuizAttempt;
  } catch (error) {
    console.error("Error getting latest quiz attempt:", error);
    return null;
  }
};

// Check if user has a connected wallet
export const isUserAuthenticated = () => {
  const walletAddress = localStorage.getItem('connectedAddress');
  return walletAddress !== null;
};

// Get current wallet address
export const getCurrentUserId = () => {
  return localStorage.getItem('connectedAddress')?.toLowerCase() || null;
};

export default {
  db,
  saveUser,
  getUser,
  updateUserXP,
  saveAgent,
  getAgents,
  purchaseAgent,
  saveChatMessage,
  getUserChatHistory,
  saveQuizAttempt,
  getQuizAttempts,
  getLatestQuizAttempt,
  isUserAuthenticated,
  getCurrentUserId
};