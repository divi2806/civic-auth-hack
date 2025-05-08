import firebaseService from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, getDoc, updateDoc, writeBatch, setDoc, CollectionReference, Query, DocumentData } from 'firebase/firestore';
import { mockAgents } from '../lib/mockAgents';
import { mockHumanAgents } from '../lib/mockHumanAgents';
import { Agent } from '@/types';

const AGENTS_COLLECTION = 'agents';
const { db } = firebaseService;

// Get all agents with optional type filter
export const getAllAgents = async (agentType?: 'ai' | 'human') => {
  try {
    const agentsCollection = collection(db, AGENTS_COLLECTION);
    let agentQuery: Query<DocumentData>;
    
    // If agentType is specified, filter by it
    if (agentType) {
      agentQuery = query(agentsCollection, where("agentType", "==", agentType));
    } else {
      agentQuery = query(agentsCollection);
    }
    
    const agentSnapshot = await getDocs(agentQuery);
    
    // If no agents in Firestore, load mock data
    if (agentSnapshot.empty) {
      console.log("No agents found in Firestore. Loading mock data...");
      await loadMockAgents();
      // Get agents again after loading mock data
      const newSnapshot = await getDocs(agentQuery);
      return newSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Agent[];
    }
    
    return agentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Agent[];
  } catch (error) {
    console.error("Error getting agents:", error);
    return [];
  }
};

// Load mock agents into Firestore
export const loadMockAgents = async () => {
  try {
    const batch = writeBatch(db);
    const agentsRef = collection(db, AGENTS_COLLECTION);
    
    // Check if agents collection already has data
    const agentSnapshot = await getDocs(query(agentsRef));
    if (!agentSnapshot.empty) {
      console.log("Agents collection already has data. Skipping mock data load.");
      return;
    }
    
    // Add each mock AI agent to Firestore
    const aiAddPromises = mockAgents.map(agent => {
      const { id, ...agentWithoutId } = agent;
      const docRef = doc(agentsRef, id);
      return setDoc(docRef, {
        ...agentWithoutId,
        purchasedBy: agentWithoutId.purchasedBy || [],
        agentType: 'ai' // Ensure AI type is set
      });
    });
    
    // Add each mock human agent to Firestore
    const humanAddPromises = mockHumanAgents.map(agent => {
      const { id, ...agentWithoutId } = agent;
      const docRef = doc(agentsRef, id);
      return setDoc(docRef, {
        ...agentWithoutId,
        purchasedBy: agentWithoutId.purchasedBy || [],
        agentType: 'human' // Ensure human type is set
      });
    });
    
    await Promise.all([...aiAddPromises, ...humanAddPromises]);
    console.log(`Successfully loaded ${mockAgents.length + mockHumanAgents.length} mock agents into Firestore.`);
    return true;
  } catch (error) {
    console.error("Error loading mock agents:", error);
    return false;
  }
};

// Add a new agent - now with better error handling and agentType support
export const addAgent = async (agentData: Partial<Agent>) => {
  try {
    // Validate that there is a creatorId before proceeding
    if (!agentData.creatorId) {
      throw new Error("Creator ID is required to add an agent");
    }
    
    // Validate agentType
    if (!agentData.agentType || !['ai', 'human'].includes(agentData.agentType)) {
      throw new Error("Valid agent type (ai or human) is required");
    }
    
    const agentsRef = collection(db, AGENTS_COLLECTION);
    
    // Add timestamp and ensure purchasedBy is initialized
    const agentWithTimestamp = {
      ...agentData,
      dateCreated: new Date().toISOString(),
      purchasedBy: agentData.purchasedBy || []
    };
    
    // Add to Firestore
    const docRef = await addDoc(agentsRef, agentWithTimestamp);
    
    // Return the complete agent with its new ID
    return {
      id: docRef.id,
      ...agentWithTimestamp as object
    } as Agent;
  } catch (error) {
    console.error("Error adding agent:", error);
    throw error; // Re-throw to handle in the component
  }
};

// Delete an agent
export const deleteAgent = async (agentId: string) => {
  try {
    // Check if wallet is connected - similar to your checkWalletAuth() function in firebase.ts
    const walletAddress = localStorage.getItem('connectedAddress');
    if (!walletAddress) {
      throw new Error("Not authenticated with wallet");
    }
    
    // Get the agent to check if the current user is the creator
    const agentRef = doc(db, AGENTS_COLLECTION, agentId);
    const agentDoc = await getDoc(agentRef);
    
    if (!agentDoc.exists()) {
      throw new Error("Agent not found");
    }
    
    const agentData = agentDoc.data();
    
    // Check if the current user is the creator
    if (agentData.creatorId.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error("Permission denied: You can only delete agents you have created");
    }
    
    // Delete the document
    await deleteDoc(agentRef);
    return true;
  } catch (error) {
    console.error("Error deleting agent:", error);
    throw error;
  }
};

// Get agents by creator ID
export const getAgentsByCreator = async (creatorId: string, agentType?: 'ai' | 'human') => {
  try {
    const agentsRef = collection(db, AGENTS_COLLECTION);
    let q: Query<DocumentData>;
    
    if (agentType) {
      q = query(agentsRef, 
        where("creatorId", "==", creatorId),
        where("agentType", "==", agentType)
      );
    } else {
      q = query(agentsRef, where("creatorId", "==", creatorId));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Agent[];
  } catch (error) {
    console.error("Error getting creator's agents:", error);
    return [];
  }
};

// Purchase an agent
export const purchaseAgent = async (agentId: string, userId: string) => {
  try {
    const agentRef = doc(db, AGENTS_COLLECTION, agentId);
    const agentDoc = await getDoc(agentRef);
    
    if (!agentDoc.exists()) {
      throw new Error("Agent not found");
    }
    
    const agentData = agentDoc.data();
    const purchasedBy = agentData.purchasedBy || [];
    
    // Add buyer if not already purchased
    if (!purchasedBy.includes(userId)) {
      await updateDoc(agentRef, {
        purchasedBy: [...purchasedBy, userId]
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error updating purchase:", error);
    throw error;
  }
};

// Initialize Firestore with mock data on app startup
export const initializeFirestore = async () => {
  try {
    // Check if we need to load mock data
    const agentsRef = collection(db, AGENTS_COLLECTION);
    const agentSnapshot = await getDocs(agentsRef);
    if (agentSnapshot.empty) {
      console.log("Initializing Firestore with mock data...");
      await loadMockAgents();
      return true;
    }
    console.log("Firestore already contains agent data. Skipping initialization.");
    return false;
  } catch (error) {
    console.error("Error initializing Firestore:", error);
    return false;
  }
};

// Get an agent by ID
export const getAgentById = async (agentId: string) => {
  try {
    const agentRef = doc(db, AGENTS_COLLECTION, agentId);
    const agentDoc = await getDoc(agentRef);
    if (agentDoc.exists()) {
      return {
        id: agentDoc.id,
        ...agentDoc.data() as object
      } as Agent;
    }
    return null;
  } catch (error) {
    console.error("Error getting agent by ID:", error);
    return null;
  }
};

// Get agents by category
export const getAgentsByCategory = async (category: string, agentType?: 'ai' | 'human') => {
  try {
    const agentsRef = collection(db, AGENTS_COLLECTION);
    let q: Query<DocumentData>;
    
    if (agentType) {
      q = query(agentsRef, 
        where("category", "==", category),
        where("agentType", "==", agentType)
      );
    } else {
      q = query(agentsRef, where("category", "==", category));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as object
    })) as Agent[];
  } catch (error) {
    console.error("Error getting agents by category:", error);
    return [];
  }
};

// Get agents by type (AI or human)
export const getAgentsByType = async (agentType: 'ai' | 'human') => {
  try {
    const agentsRef = collection(db, AGENTS_COLLECTION);
    const q = query(agentsRef, where("agentType", "==", agentType));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as object
    })) as Agent[];
  } catch (error) {
    console.error(`Error getting ${agentType} agents:`, error);
    return [];
  }
};

// Update agent's purchased by field (legacy function, kept for compatibility)
export const updateAgentPurchase = async (agentId: string, buyerId: string) => {
  return purchaseAgent(agentId, buyerId);
};

// Search agents by name, description or category
export const searchAgents = async (searchTerm: string, agentType?: 'ai' | 'human') => {
  try {
    // Get all agents (optionally filtered by type)
    const agents = await getAllAgents(agentType);
    
    // Filter by search term (client-side search)
    const searchTermLower = searchTerm.toLowerCase();
    return agents.filter(agent => 
      agent.name.toLowerCase().includes(searchTermLower) ||
      agent.description.toLowerCase().includes(searchTermLower) ||
      agent.category.toLowerCase().includes(searchTermLower)
    );
  } catch (error) {
    console.error("Error searching agents:", error);
    return [];
  }
};

export default {
  getAllAgents,
  addAgent,
  deleteAgent,
  getAgentsByCreator,
  purchaseAgent,
  updateAgentPurchase,
  loadMockAgents,
  initializeFirestore,
  getAgentById,
  getAgentsByCategory,
  getAgentsByType,
  searchAgents
};